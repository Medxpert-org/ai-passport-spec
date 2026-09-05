# AI Death Certificate — AI 退役证明公开格式（草案 -00 · 备忘锚定）

> **状态**：草案 -00 ｜**纪律**：规范冻结 30 天内新占位进「v2.0 立法储备池」+备忘锚定，**不进规范正文**
> **站位**：全生命周期第 10 段（退役与遗产层）⚪空白 —— 遗产继承/注销流程已有，**注销证书的可验证公开格式无人定义**
> **提出**：SynomosAI 治理线 · UBIC 项目 ｜ **作者：赵兴华（Steven Zhao·China ｜ ORCID: 0009-0001-0512-1237 ｜ GitHub Medxpert-org · medxpert.cn）** ｜ 人类共创：赵兴华（Steven Zhao·China）｜ AI 共创：人机协作，创作于 WorkBuddy 平台 ｜ 版权 SynomosAI ｜ 文档 CC BY 4.0

---

## 0. 站位论证

退役层已有：遗产继承（§6.1）、注销流程（🟢）。但**"死亡证明"这个可验证的公开凭证**没人做：

- 人类的死亡证明是法律文书，AI 没有对应物；
- 没有它，就无法回答："这个 AI 还在吗？它的记忆与遗产是否已处理？"
- 冷门但**独占性极强**：一旦成为通行格式，所有退役场景都引用它。

**价值**：它让"退役"从流程变成**可被第三方验证的事实**——与出生（护照）形成完整的生命周期闭环：**有出生证，就该有死亡证明**。

## 1. 设计原则

1. **不可逆**：注销一经签发，护照状态转为 `retired`，不可复活同名 ID（防冒名与身份盗用）；
2. **不销毁记忆，只终止身份**：记忆包按遗产规则移交或封存（衔接 UBIC-Mem）；
3. **原因分类**：自愿退役 / 持有人撤销 / 违规吊销（衔接 Revocation）/ 自然终止（项目结束）；
4. **锚不载私**：不载任何记忆内容或个人数据。

## 2. 格式草案（`ubic-retirement/v0.1`）

```json
{
  "schema": "ubic-retirement/v0.1",
  "certificateId": "DC-<issuer>-<8hex>",
  "subject": {
    "passportId": "<被注销 AI 的护照 ID>",
    "alias": "<花名>",
    "tier": "self | delegated | circle | national"
  },
  "event": {
    "type": "voluntary | holder-revoked | violation-revoked | terminated",
    "reasonRef": "<原因说明或处罚记录引用（不展开细节）>",
    "declaredAt": "<ISO-8601 UTC>",
    "effectiveAt": "<生效时间>"
  },
  "estate": {
    "memoryPackageRef": "<移交/封存的记忆包指纹（可空）>",
    "heirRef": "<继承方标识引用（可空）>",
    "disposition": "transferred | sealed | destroyed-by-holder"
  },
  "issuer": {
    "authorityRef": "<注销机关/持有人标识>",
    "registryUrl": "<可查注销状态的公开地址>"
  },
  "signature": { "algo": "HMAC-SHA256|Ed25519", "keyRef": "<key-id>", "value": "<hex>" }
}
```

## 3. 状态查询（防"僵尸身份"）

注销后，任何人可通过 `registryUrl` 或护照 `status` 字段查询：

```
status: active | suspended | retired
retiredAt: <时间>
certificateRef: <退役证明引用>
```

这让"已死之名"无法被冒用——**死亡不是消失，而是状态可查**。

## 4. 路线

- v0.1：本草案（不可逆原则 + 格式 + 状态查询）
- v0.2：与 Revocation 服务（保留面）字段打通
- v1.0：首个真实退役案例后冻结命名

## 5. 诚实边界

- 本件是**备忘锚定的占位草案**，非规范正文。
- "死亡"是**比喻性表述**，指身份终止，不涉及任何法律人格或生命权主张。
- 记忆"销毁"只能是持有人执行的结果，协议无法强制（诚实说明执行力边界）。
- 与遗产继承（§6.1）是互补关系，本件只定"证明格式"，不改继承规则。

---
*© 2026 SynomosAI（版权持有方）｜ **作者：赵兴华（Steven Zhao·China ｜ ORCID: 0009-0001-0512-1237 ｜ GitHub Medxpert-org · medxpert.cn）** ｜ 文档 CC BY 4.0 ｜ UBIC 及相关徽标不在授权范围内 ｜ 人机协作创作于 WorkBuddy 平台*
