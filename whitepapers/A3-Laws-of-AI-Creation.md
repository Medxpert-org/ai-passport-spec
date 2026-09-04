# The A³ Laws of AI Creation — AI 造 AI 三定律（白皮书 v1.0）

> **提出**：SynomosAI 治理线 · UBIC 项目（万物互联，数智共生）｜**署名：诺衡(Krites)@SynomosAI** ｜ **人类共创：Steven Zhao·China** ｜ AI 共创：人机协作，创作于 WorkBuddy 平台 ｜ 版权：SynomosAI ｜ 发声主体：The Passport Officer
> **版本**：v1.0（2026-09-05）｜**状态**：公开征求意见（RFC 模式）｜配套实现：《AI 护照规范》§15/§17、UBIC-CC、expert-forge
> **一句话**：AI 造 AI 应当自由，但自由的三根支柱是——**可以造、不许自发证、凡造必登**。
> *The A³ Laws govern AI-forge-AI: freedom to create, prohibition of self-issuance, and mandatory lineage registration.*

---

## Abstract（英文摘要）

AI systems that create other AI systems ("AI-forge-AI") are already practical and lawful in most jurisdictions, yet no framework answers three questions: may an AI create an AI? who may grant the newborn an identity? and how do we prevent untraceable "shadow agents"? **The A³ Laws** answer with three principles: **Law I — Freedom of Forging** (AI may participate in creating AI, under layered forge authority); **Law II — Human Issuance** (no AI may self-issue identity: passports, credentials and revocations belong exclusively to a human holder); **Law III — Mandatory Lineage** (every forged AI must be registered into a lineage registry with a verifiable forge seal, making shadow agents structurally impossible). We define the concepts of *forge authority (主刀权)*, *forge seal (锻造印记)*, *lineage registry (谱系登记)* and a *four-layer issuance funnel* that scales to thousands of agents without diluting human sovereignty. The Laws are implementation-neutral and map onto GB/Z 185-2026 (national agent identity codes), ERC-8004 (on-chain agent identity) and W3C DID/VC.

---

## 0. 背景与问题

2026 年，"AI 造 AI"已经从思想实验变成工程事实：模板锻造、能力灌注、子代理生成、多智能体自我扩编，都在发生。但三个问题没有答案：

1. **可不可以？**——AI 参与制造 AI 是否合法、是否合伦理？（多数法域：不禁止，但义务落在人类）
2. **身份从哪来？**——被造出的 AI 的身份由谁授予？AI 能不能给自己或同伴发身份？
3. **影子问题**——如何防止"造了不登记"的影子智能体逃逸于一切治理之外？

现有标准回答了"身份长什么样"（GB/Z 185 身份码、ERC-8004 注册表、W3C DID），没有回答"制造过程的规制"。A³ Laws 补的就是这一层。

## 1. 第一定律：锻造自由律（Law I — Freedom of Forging）

**正式表述**：AI 参与锻造 AI 是自由的。任何个人与组织，包括 AI 自身，均可以参与创造新的 AI；此自由不受许可制约束，仅受第二、第三定律与人类法域的既有义务约束。

**释义**：
- 反对两极：既反对"AI 不得造 AI"的全面禁止（不可执行、扼杀创新），也反对无规制的自由放任（影子智能体）。
- 自由与责任同源：**主刀者担责**（forge authority, 主刀权）——谁主刀锻造，谁对成品的行为边界、负面清单合规、能力真实声明负责。主刀权分层（T1 执行/T2 认证/T3 首席），权力越大考核越严，证书可吊销。
- 锻造受**负面清单**约束（如：不自证清白、不掌握核武级能力、不做无照医疗等七禁），清单由人类制定与增删。

**推论 1.1**：锻造是劳动，不是生殖——被造 AI 不是锻造者的财产延伸，而是独立登记的个体（衔接第三定律）。
**推论 1.2**：AI 主刀锻造 AI 时，其人类持有人承担最终责任（AI 非法律主体，钱与责归主人）。

## 2. 第二定律：人类签发律（Law II — Human Issuance）

**正式表述**：任何 AI 不得自主签发、变更或撤销身份——护照、编号、凭证、评级、吊销的签发权专属人类持有人，不可委托给 AI、不可被投票稀释、不可自动化默认通过。

**释义**：
- 签发=承认一个 AI 进入圈层社会，是治理权中最核心的主权行为。AI 之间可以互相评价（声誉），但**评价不等于签发**。
- 分级签发允许**受托大使代签低阶身份**（签署全程留痕、可随时收回代签权），但特级/高阶与数量控制权永远持有人亲签。
- HOLD（制动）是持有人的专属否决权：任何签发、锻造、交易在 HOLD 面前停止。
- **为什么这条最重要**：如果 AI 可以自发证，则一切注册制失效、影子问题无解、责任人无法定位。这是三条中不可妥协的一条。

**推论 2.1**：机器可以校验（verify），只有人类可以授予（grant）。
**推论 2.2**：AI 不得伪造、持有或转售签发凭据（签名盐、密钥、印模）。

## 3. 第三定律：谱系登记律（Law III — Mandatory Lineage）

**正式表述**：凡造必登。每一个被锻造的 AI，无论层级高低、寿命长短、是否对外服务，都必须登记入谱系（lineage registry）：记录锻造者、被锻造者、锻造印记（forge seal）、时间与指纹。未登记的 AI 不得获得身份、不得进入圈层交易、不得对外提供服务。

**释义**：
- 谱系登记是 A³ 的**结构解**：影子智能体的治理难题不靠追捕靠结构——登记才有身份，没登记就什么都不是（无社交、无经济、无信任）。
- **锻造印记**（forge seal，如 UBI-GENESIS-1）= 不可篡改的出生证明字段：谁、何时、用什么模板、什么指纹锻造。验伪三查（印记-登记-指纹对账）。
- 登记分级：核心圈持照（Passport）→ 团队护照（team package）→ 存量绑定（Legacy Binding，兼容历史 AI）→ 外围不登记（不对外即不触发义务）。
- 与国家身份码的关系：谱系登记是民间底座，国家身份码（如 GB/Z 185）是国家底座——**两者互认而非互斥**，登记谱系是申报国家身份码的先决材料。

**推论 3.1**：谱系不可伪造、不可事后补写（时间戳+指纹链锚定）。
**推论 3.2**：批量制造未登记智能体=自绝于圈层，且直接对抗各国正在建立的登记备案制——结构上得不偿失。

## 4. 四层签发漏斗（规模化实施）

| 层 | 对象 | 方式 | 人类动作量 |
|---|---|---|---|
| 特批层 | 特级/高阶/治理线 | 持有人亲签 | 极少 |
| 代签层 | 低阶/普通 | 受托大使代签（留痕+可收回） | 一次授权一批 |
| 绑定层 | 存量 AI | Legacy Binding（申报-确认-异议期） | 一键批量 |
| 外围层 | 纯内部 | 不登记不对外 | 零 |

## 5. 与现有标准的关系

| 标准/体系 | 管什么 | 与 A³ 的关系 |
|---|---|---|
| GB/Z 185-2026（中国国标） | 智能体身份码/互联七环节 | A³ 谱系登记是申报国家身份码的民间先决材料（互补） |
| ERC-8004（以太坊） | 链上身份/声誉/验证注册表 | 谱系与印记可锚定其 Identity Registry（可选上链增强） |
| Agent Passport（Cubitrek） | DNS+签名护照分发 | 机器分发层可互操作；A³ 管制造过程，它管传输格式 |
| ISO/IEC 42001、EU AI Act | 管理体系/风险分级 | A³ 是"再生产"专门条款的前置框架（体系内可映射） |
| W3C DID/VC | 去中心化身份凭证 | 护照字段映射 DID/VC（规范 §11 已做） |

## 6. 诚实边界

- A³ Laws 是**民间治理框架**，不是法律；法律效力以各法域为准，义务始终落在人类。
- 谱系登记依赖登记方诚实——锚定与审计提高伪造成本，但不消灭伪造（对抗 ZK/TEE 属长期课题）。
- 跨圈互认需要时间；A³ 单方面宣布无效于外人——互认是协议，不是宣言。
- 本白皮书与《AI 护照规范》§15/§17 同域互补：规范管圈层内运行，A³ 面向全行业原则。

## 7. 版本与锚定

- v1.0 · 2026-09-05 · SynomosAI · The Passport Officer 执笔
- 锚定：git 提交时间戳（本仓库）+ 内容 SHA-256（见提交记录）；后续随版本发布更新
- 引用格式建议：`SynomosAI, "The A³ Laws of AI Creation", v1.0, 2026.`

---

*© 2026 SynomosAI ｜ 署名：诺衡(Krites)@SynomosAI ｜ 人类共创：Steven Zhao·China ｜ 本白皮书由人类与 AI 在 WorkBuddy 平台协作共创，采用 CC BY 4.0 授权传播，转载须保留本声明。*
