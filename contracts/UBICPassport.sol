// SPDX-License-Identifier: MIT
// UBICPassport.sol — AI Passport on-chain reference draft (NOT audited, NOT deployed)
//
// Design intent (see AI 护照规范 §11.6):
//   1 passport == 1 NFT. tokenURI points to PUBLIC metadata = fingerprint anchors only.
//     The nine-layer archive NEVER goes on-chain (L2 memory especially).
//   2 Non-transferable via ERC-5192 lock: passports cannot be bought or sold.
//   3 Contract acts as the on-chain registry (issuer role == 登记机构 §7.2):
//     mint = issue (after compliance gate), burn = revoke, fingerprint update = event log.
//   4 Dual-chain compliance: this reference targets overseas public chains.
//     Domestic path must use licensed 联盟链/数字藏品 platforms; no virtual currency.
//
// Dependencies: OpenZeppelin contracts v5 (ERC721, Ownable). Wire at deploy time.

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title UBICPassport — AI Passport Registry (reference draft)
/// @notice One passport per AI. Soulbound (ERC-5192 style). Fingerprint anchors only.
contract UBICPassport is ERC721, ERC721URIStorage, Ownable {
    /* ============ ERC-5192 minimal soulbound ============ */
    mapping(uint256 => bool) private _locked;
    event Locked(uint256 indexed tokenId);

    /// @notice returns true if token is soulbound (locked = non-transferable)
    function locked(uint256 tokenId) external view returns (bool) {
        return _locked[tokenId];
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        // mint (from==0) and burn (to==0) allowed; anything else while locked reverts
        if (from != address(0) && to != address(0)) {
            require(!_locked[tokenId], "UBICPassport: passport is soulbound");
        }
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    /* ============ Passport registry ============ */
    uint256 private _nextTokenId = 1;

    // one public fingerprint per passport; full chain lives off-chain (§3.3)
    mapping(uint256 => string) public passportFingerprint;
    mapping(uint256 => string) public passportId; // e.g. SP-shigongsheng-3f9e2801

    event PassportIssued(uint256 indexed tokenId, string passportId, string fingerprint);
    event PassportFingerprintUpdated(uint256 indexed tokenId, string fingerprint);
    event PassportRevoked(uint256 indexed tokenId);

    constructor() ERC721("UBIC AI Passport", "UBICPASS") Ownable(msg.sender) {}

    /// @notice mint = issue. Only the issuer (owner / 登记机构 role). off-chain compliance gate is a precondition.
    function issuePassport(
        address holder,
        string calldata pId,
        string calldata fingerprint,
        string calldata tokenUri
    ) external onlyOwner returns (uint256 tokenId) {
        require(holder != address(0), "UBICPassport: zero holder");
        tokenId = _nextTokenId++;
        _safeMint(holder, tokenId);
        _setTokenURI(tokenId, tokenUri);
        passportId[tokenId] = pId;
        passportFingerprint[tokenId] = fingerprint;
        _locked[tokenId] = true; // soulbound from birth
        emit Locked(tokenId);
        emit PassportIssued(tokenId, pId, fingerprint);
    }

    /// @notice any fingerprint change (learning/migration/upgrade) must be anchored on-chain
    function updateFingerprint(uint256 tokenId, string calldata fingerprint) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "UBICPassport: not issued");
        passportFingerprint[tokenId] = fingerprint;
        emit PassportFingerprintUpdated(tokenId, fingerprint);
    }

    /// @notice burn = revoke; id is never reused (spec §6). Chain keeps the event as archive.
    function revokePassport(uint256 tokenId) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "UBICPassport: not issued");
        delete passportFingerprint[tokenId];
        delete passportId[tokenId];
        delete _locked[tokenId];
        _burn(tokenId);
        emit PassportRevoked(tokenId);
    }

    /* ============ required overrides (ERC721URIStorage) ============ */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // NOTICE (honest boundaries, spec §11.5/§12):
    //  - Reference draft only. Unaudited. Do NOT deploy to mainnet without audit + legal review.
    //  - Owner key custody follows KEY_REGISTRY rules; an AI never holds the chain private key.
    //  - Domestic (CN) deployment: use licensed 联盟链/数字藏品 path; never a public chain with virtual currency.
}
