import React, { useState, useEffect, useMemo } from "react";

/* ============================================================
   科技成果转化 · 工商注册前准备清单（交互式）
   情景：一名研究生刚有科研成果，听完创业课，准备注册公司
   每一项标注"谁来做"：很多事学生一个人办不了
   政策依据：职务科技成果赋权改革（先确权后转化）；
            技术入股递延纳税 财税〔2016〕101号、总局公告2016年第62号
   ============================================================ */

const C = {
  paper: "#f6f2e9",
  paper2: "#fffdf7",
  ink: "#23241f",
  inkSoft: "#5b5d52",
  line: "#d8d2c2",
  green: "#1f5d46",
  greenSoft: "#e7efe9",
  blue: "#1c5a78",
  blueSoft: "#e2eef4",
  seal: "#a8341f",
  sealSoft: "#f6e6e1",
  gold: "#9a7b2e",
  amberSoft: "#f5ecd2",
};

const serif = '"Songti SC","STSong","SimSun","Noto Serif SC",Georgia,serif';
const sans = '"PingFang SC","Hiragino Sans GB","Microsoft YaHei","Noto Sans SC",sans-serif';

// 谁来做
const ROLE = {
  self: { label: `你自己能做`, color: C.green, bg: C.greenSoft },
  school: { label: `找学校转化办`, color: C.blue, bg: C.blueSoft },
  pro: { label: `找评估/律所/税务`, color: C.gold, bg: C.amberSoft },
  later: { label: `先知道·到时办`, color: C.inkSoft, bg: "#ece8dd" },
};

const STAGES = [
  {
    num: "一",
    key: "queren",
    title: `先确权，别急着注册`,
    subtitle: `赋权改革：先确权、后转化`,
    accent: C.blue,
    why: `职务科技成果赋权改革的核心是"先确权、后转化"——先把成果归谁定下来，再去注册公司。这一步几乎全靠学校，但必须由你主动发起。跳过它直接注册、把成果塞进公司，是高校创业最容易踩、也最致命的雷。`,
    benefit: `成果合法地变成"你（团队）与学校共有"或归你所有，公司将来用的是一份产权清楚的资产；后面的估值、股权、税务才有地基。`,
    avoid: `避免：成果其实属于学校（用了学校设备/经费/课题），却登记在个人名下成立公司，造成权属与税务双重风险，投资人直接放弃。`,
    items: [
      {
        id: "q1",
        role: "self",
        label: `确认这是不是"职务科技成果"`,
        hint: `在校期间、用了学校设备/经费/课题做出来的，基本都属于职务科技成果——不是你个人想拿就能拿走。`,
        consequence: `误以为是个人成果直接拿去注册公司，等于无权出资，后续所有安排可能被推翻。`,
      },
      {
        id: "q2",
        role: "school",
        label: `找学校成果转化办公室 / 资产经营公司`,
        hint: `这是你最先要做的一件事：问清本校的赋权与转化流程、需要填哪些表、走哪个部门。不同学校流程差别很大。`,
        consequence: `不走学校流程，成果转化在源头就不合规，未来公示、国资、上市审核都会被卡。`,
      },
      {
        id: "q3",
        role: "self",
        label: `提出赋权 / 转化申请`,
        hint: `以书面方式表达"我要把这项成果转化、去创业"的意愿，正式启动确权程序。`,
        consequence: `没有正式申请，学校无从启动确权，你只是"口头打算创业"，拿不到任何文件。`,
      },
      {
        id: "q4",
        role: "school",
        label: `拿到学校的赋权 / 确权文件`,
        hint: `学校审议后签赋权协议：把成果变更为学校与你（团队）共有，或把所有权/长期使用权赋予你。这份文件是后面一切的根。`,
        consequence: `没有这份文件，你手里的成果在法律上还是学校的，公司随时可能被收回核心资产。`,
      },
      {
        id: "q5",
        role: "self",
        label: `团队内部份额先约定清楚`,
        hint: `几个同学一起做的，提前书面约定各自贡献与份额，指定一个代表对外沟通。`,
        consequence: `事后再分极易反目；漏掉贡献人（尤其同学），将来可主张权利，动摇股权结构。`,
      },
    ],
  },
  {
    num: "二",
    key: "ip",
    title: `把"你拥有什么"列清楚`,
    subtitle: `IP 底稿 · 这部分你自己能做`,
    accent: C.green,
    why: `投资人第一眼看的不是技术多先进，而是这家公司能不能长期、独占、稳定地用这项技术。你要能拿出一张表，说清"公司到底拥有什么"。`,
    benefit: `尽调时呈现为一份"干净资产"，而不是一个"实验室项目"。这几项几乎全靠你自己整理，越早越好。`,
    avoid: `避免：存在没说清的第三方权利或开源代码，等于核心资产里埋了暗雷，上市/并购时一定被翻出来。`,
    items: [
      {
        id: "ip1",
        role: "self",
        label: `核心技术资产清单`,
        hint: `逐项列出：发明专利 / 实用新型 / 软件著作权 / 技术秘密 / 数据资产 / 样机图纸 / 工艺参数 / 测试报告。一张可核对的表，而不是一句"我们有技术"。`,
        consequence: `没有清单，投资人无法判断公司到底拥有什么，给人"东西没理清"的不专业印象。`,
      },
      {
        id: "ip2",
        role: "self",
        label: `每项成果的"形成过程"说明`,
        hint: `分别写清：用了哪些学校资源、是否用横向/纵向课题经费、什么时候完成。这也是判断职务成果归属的依据。`,
        consequence: `说不清形成过程，投资人会默认它可能属于学校，担心未来被追索核心资产。`,
      },
      {
        id: "ip3",
        role: "self",
        label: `第三方权利与开源排查`,
        hint: `是否嵌入开源代码（注意开源协议）、是否有企业合作开发背景、是否引用第三方专利或数据。`,
        consequence: `未披露的第三方权利就是核心资产上的"暗雷"，越晚发现代价越高。`,
      },
      {
        id: "ip4",
        role: "self",
        label: `专利/软著证书、申请号集中归档`,
        hint: `证书、受理通知书、专利族清单、申请号，集中放在一处。`,
        consequence: `证书找不到，尽调中无法验证权利存在，"权属清晰"就只是一句空话。`,
      },
    ],
  },
  {
    num: "三",
    key: "structure",
    title: `决定成果怎么进公司 + 找评估`,
    subtitle: `作价不是越高越好`,
    accent: C.green,
    why: `技术作价必须和商业成熟度匹配。一个还没客户验证的技术若作价过高，等于"把未来价值提前分完了"——公司还没跑，股权就被占满，后面招不到人、融不到资。`,
    benefit: `股权结构留出空间给团队、员工期权池和后续投资人；估值能被审计和投资人接受。`,
    avoid: `避免：早期就让技术股占 60% 以上，现金投资人进来后三方股权都很紧，治理复杂、融资受阻。`,
    items: [
      {
        id: "s1",
        role: "self",
        label: `诚实判断成果成熟度`,
        hint: `如实标注：实验室样机 / 接近量产 / 已有产业订单。成熟度直接决定能支撑多高的作价。`,
        consequence: `夸大成熟度，作价与现实脱节，投资人一旦发现会全面质疑团队诚信。`,
      },
      {
        id: "s2",
        role: "self",
        label: `选择成果进入公司的方式`,
        hint: `早期建议"独占许可 + 小比例股权 + 里程碑付款"；已接近量产/有订单的成熟成果，才考虑较高比例作价入股。这是你要带去和学校谈的方案。`,
        consequence: `方式选错（早期就大比例作价入股），后续每一轮融资都会被这块"过重的历史股权"拖累。`,
      },
      {
        id: "s3",
        role: "pro",
        label: `第三方资产评估报告`,
        hint: `作价入股、确定学校份额价款都要由有资质的评估机构出报告。你自己做不了，但要知道必须请、并提前预留时间和费用。`,
        consequence: `没有评估或评估虚高，作价无依据，递延纳税的原值也认定不了，融资时被要求重做。`,
      },
      {
        id: "s4",
        role: "self",
        label: `画一张股权结构草表`,
        hint: `列明：学校/平台、你和团队、预留员工期权池 大致各占多少。先有个草图，再去和学校、未来投资人谈。`,
        consequence: `结构表缺失或全职团队股权过低，投资人会判断"没人真正负责"，动力不足。`,
      },
    ],
  },
  {
    num: "四",
    key: "tax",
    title: `把税务递延"做对"`,
    subtitle: `注册当时与注册后 · 现在先知道`,
    accent: C.seal,
    flag: "重点",
    why: `依据财税〔2016〕101号、国家税务总局公告2016年第62号：以技术成果投资入股、且对价全部为股权的，经向税务机关备案，投资入股当期可暂不纳税，递延到将来转让股权时再按差额缴。注意——这些动作大多在注册时和注册后才办，你现在要做的是"提前知道、到时一次做对"。`,
    benefit: `取得股权当期不用先掏一大笔税；交易能一次闭环，不会在融资交割前被要求停下来整改。`,
    avoid: `避免：① 没办备案——按规定未办理备案不得享受递延；② 把技术入股和现金/服务费/奖金混在一份协议里，破坏"对价全部为股权"的条件。`,
    items: [
      {
        id: "t1",
        role: "later",
        label: `知道有递延政策（101号 / 62号公告）`,
        hint: `核心一句：技术入股暂不缴税，递延到将来卖股权时，按"转让收入 − 成果原值 − 合理税费"的差额、按 20% 缴个税。它是"晚交"，不是"不交"。`,
        consequence: `不知道有这政策，可能在入股当期被要求按评估值一次性缴一大笔税，现金根本拿不出。`,
      },
      {
        id: "t2",
        role: "pro",
        label: `把对价设计成"全部为股权"`,
        hint: `技术出资换的必须全是股权，不要在同一笔里混现金。这是能不能递延的硬条件，签协议前先和律师/税务确认。`,
        consequence: `对价里混了现金，混合部分要当期缴税，递延资格可能整体被破坏。`,
      },
      {
        id: "t3",
        role: "self",
        label: `留好评估报告与确权文件`,
        hint: `就是第三步的评估报告、第一步的确权文件，作为成果原值和权属的依据，务必保留原件。`,
        consequence: `原值和权属说不清，将来转让时税款算不准，备案也办不了。`,
      },
      {
        id: "t4",
        role: "later",
        label: `注册后及时办递延备案`,
        hint: `按规定在投资完成后首次企业所得税预缴申报时，填《技术成果投资入股企业所得税递延纳税备案表》并留档。会计/税务师经办，但你要盯着它办掉。`,
        consequence: `漏了这一步，即使其他都对，也直接丧失递延资格，只能当期缴税。`,
      },
      {
        id: "t5",
        role: "pro",
        label: `不同性质的钱分开签协议`,
        hint: `技术入股、顾问费、研发服务费、奖金，各按各自税目分别签，别写成"一锅粥"。`,
        consequence: `混在一份协议里，税务处理模糊，投资人会要求拆开重签，甚至废止原协议。`,
      },
      {
        id: "t6",
        role: "self",
        label: `团队签"递延≠免税"知情确认`,
        hint: `让每个拿股权的成员签字确认：将来卖股权 / 分红 / 退出时仍要依法缴税。`,
        consequence: `没说清，将来退出收款时"为什么还要缴税"的争执可能卡住股权交割。`,
      },
    ],
  },
  {
    num: "五",
    key: "habit",
    title: `从第一天养成归档习惯`,
    subtitle: `现在就开始，别想着"以后补"`,
    accent: C.gold,
    why: `合规管理不是一次性动作，而是长期的台账 + 归档习惯。公司发展快时最容易想"先把业务做起来，文件以后补"——几年后上市/并购倒查历史，补材料、找人签字极其痛苦。这些习惯你现在（甚至公司还没注册）就能开始。`,
    benefit: `将来审计、券商、律师能快速核查，省下大量时间和钱；原件不会丢。`,
    avoid: `避免：评估报告、备案表、确权协议丢失或散落在个人手机里，上市前补不回来、拖延申报。`,
    items: [
      {
        id: "h1",
        role: "self",
        label: `现在就建一张"股权与成果登记表"`,
        hint: `一张空白模板即可，一行一笔：谁取得股权、因何取得、对应哪项成果、评估值多少、是否已备案递延。以后每次变动就补一行。`,
        consequence: `事后回忆补录极易出错遗漏，历史股权说不清，是上市倒查时最痛的地方。`,
      },
      {
        id: "h2",
        role: "self",
        label: `所有原件扫描归档，云端 + 本地各一份`,
        hint: `确权协议、评估报告、入股协议、备案表、工商材料，统统扫描存好。`,
        consequence: `原件丢失，几年后几乎无法补回，直接成为上市障碍。`,
      },
      {
        id: "h3",
        role: "self",
        label: `用团队/公司统一账号保存`,
        hint: `别只存在个人手机或个人网盘——成员离开、换设备，文件就丢了。`,
        consequence: `关键人离开把资料带走或丢失，公司陷入被动。`,
      },
    ],
  },
  {
    num: "六",
    key: "dd",
    title: `提前知道投资人会问什么`,
    subtitle: `前五步做好，这些自然答得上`,
    accent: C.green,
    why: `你现在不用准备一堆答复文件。只要前面五步扎实，投资人尽调最常问的问题你都答得上。这一步是让你心里有数，把潜在"红旗"提前变成"加分项"。`,
    benefit: `面对投资人不慌；尽调顺畅，信任稳固。`,
    avoid: `避免：用"反正能递延、不用交税"去动员同学/老师参与；将来一旦发现要缴税，内部先闹起来。`,
    items: [
      {
        id: "d1",
        role: "self",
        label: `一句话讲清成果权属`,
        hint: `谁确权的、学校份额怎么处理、你团队怎么持股——能一口气说清楚。`,
        consequence: `权属讲不清，投资人会怀疑公司治理和合规能力，而不只是当成小瑕疵。`,
      },
      {
        id: "d2",
        role: "self",
        label: `留意商业验证的苗头`,
        hint: `哪怕还很早，也开始攒：潜在客户名单、试点意向、谁愿意先用、愿不愿付钱。`,
        consequence: `只有技术没有任何验证，估值"把未来分完了"，投资人难以接受。`,
      },
      {
        id: "d3",
        role: "later",
        label: `和团队/学校对齐未来的税务与责任预期`,
        hint: `提前通气：将来卖股权要缴税、万一要补税谁承担——这些到融资时一定会被谈到，早沟通少纠纷。`,
        consequence: `到融资/退出才发现预期不一致，交易可能卡在内部分歧上。`,
      },
    ],
  },
];

const INVESTOR_QS = [
  `这项科技成果权属是谁？学校、个人、公司之间有没有完整的赋权或转让文件？`,
  `成果入股时是否做了资产评估？评估方法和评估值是否合理？`,
  `被投资企业支付的对价是否全部为股权？有没有混现金、服务费、顾问费？`,
  `是否办理了递延纳税备案？备案材料在哪里？`,
  `学校平台、科研团队、个人之间的股权和收益分配是否清楚？`,
  `公司有没有股权与成果登记台账？`,
  `全职经营团队是谁？股权激励是否到位？`,
  `技术目前有没有客户验证、订单或试点？`,
  `未来上市、并购、老股转让时，递延税款由谁承担？`,
  `如果税务机关要求补税、滞纳金或处罚，责任由谁承担？`,
];

const STATUS = {
  done: { label: `搞定了`, color: C.green },
  missing: { label: `还没`, color: C.seal },
  na: { label: `不涉及`, color: C.inkSoft },
};

const RISK = [
  ["轻微", `材料不完整、但交易结构正确——可补备案、补说明。`, C.green],
  ["中等", `评估依据不足、协议混乱——需重签协议、重新评估、重设股权。`, C.gold],
  ["严重", `成果权属不清、个人无权出资、递延条件不成立——投资人可能直接放弃。`, C.seal],
  ["致命", `故意高估成果、虚假出资、逃避纳税、隐瞒学校权益——引发税务/国资/法律多重风险。`, "#d4453a"],
];

const STORAGE_KEY = "kjcg-prereg-v1";

export default function App() {
  const [active, setActive] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [showQs, setShowQs] = useState(false);

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const r = await window.storage.get(STORAGE_KEY);
        if (on && r && r.value) setAnswers(JSON.parse(r.value));
      } catch (e) {
        /* 无存储则用默认空状态 */
      } finally {
        if (on) setLoaded(true);
      }
    })();
    return () => {
      on = false;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        await window.storage.set(STORAGE_KEY, JSON.stringify(answers));
      } catch (e) {
        /* ignore */
      }
    })();
  }, [answers, loaded]);

  const setAnswer = (id, val) =>
    setAnswers((p) => ({ ...p, [id]: p[id] === val ? undefined : val }));

  const stats = useMemo(() => {
    const per = STAGES.map((s) => {
      const total = s.items.length;
      let done = 0,
        missing = 0,
        answered = 0;
      s.items.forEach((it) => {
        const v = answers[it.id];
        if (v) answered++;
        if (v === "done" || v === "na") done++;
        if (v === "missing") missing++;
      });
      return { total, done, missing, answered, ready: done === total };
    });
    const total = per.reduce((a, b) => a + b.total, 0);
    const done = per.reduce((a, b) => a + b.done, 0);
    const missing = per.reduce((a, b) => a + b.missing, 0);
    return { per, total, done, missing, pct: Math.round((done / total) * 100) };
  }, [answers]);

  const stage = STAGES[active];
  const st = stats.per[active];

  return (
    <div
      style={{
        background: `radial-gradient(120% 80% at 50% -10%, ${C.paper2}, ${C.paper})`,
        color: C.ink,
        fontFamily: sans,
        minHeight: "100%",
      }}
    >
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "34px 22px 70px" }}>
        <div style={{ marginBottom: 10 }}>
          <div
            style={{
              display: "inline-block",
              fontFamily: serif,
              fontSize: 12,
              letterSpacing: 4,
              color: C.seal,
              border: `1px solid ${C.seal}`,
              padding: "3px 10px",
              borderRadius: 2,
            }}
          >
            创业前置准备 · 工商注册前
          </div>
        </div>
        <h1
          style={{
            fontFamily: serif,
            fontSize: 33,
            lineHeight: 1.22,
            margin: "8px 0 8px",
            fontWeight: 700,
          }}
        >
          科技成果转化 · 工商注册前的准备清单
        </h1>
        <p style={{ color: C.inkSoft, fontSize: 15, lineHeight: 1.78, margin: "0 0 6px" }}>
          <strong style={{ color: C.ink }}>情景：</strong>
          你是一名研究生，手里刚做出一项科研成果，听完老师的创业课，打算把它变成一家公司。
          先别急着去工商注册——下面这些事，要在注册前（以及注册当时）一步步搞定。
          每一项都标了"<strong style={{ color: C.ink }}>谁来做</strong>"，因为很多事你一个人办不了，
          得靠学校或专业机构。你的任务是：知道该找谁、别漏掉。
        </p>
        <p style={{ color: C.seal, fontSize: 13.5, lineHeight: 1.7, margin: "8px 0 0" }}>
          最重要的一句：赋权改革讲"先确权、后转化"——先把成果归谁定下来，再注册公司。顺序反了，后面全是雷。
        </p>

        {/* 谁来做 图例 */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 16,
          }}
        >
          {Object.values(ROLE).map((r) => (
            <span
              key={r.label}
              style={{
                fontSize: 12,
                color: r.color,
                background: r.bg,
                border: `1px solid ${r.color}40`,
                borderRadius: 20,
                padding: "3px 11px",
              }}
            >
              {r.label}
            </span>
          ))}
        </div>

        {/* 总进度 */}
        <div
          style={{
            marginTop: 18,
            background: C.paper2,
            border: `1px solid ${C.line}`,
            borderRadius: 10,
            padding: "16px 18px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: 13, color: C.inkSoft }}>整体准备进度</span>
            <span style={{ fontFamily: serif, fontSize: 22, color: C.green }}>{stats.pct}%</span>
          </div>
          <div
            style={{
              height: 9,
              borderRadius: 6,
              background: "#e7e1d2",
              overflow: "hidden",
              margin: "8px 0 6px",
            }}
          >
            <div
              style={{
                width: `${stats.pct}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${C.green}, #2f7d5e)`,
                transition: "width .4s ease",
              }}
            />
          </div>
          <div style={{ fontSize: 12.5, color: C.inkSoft }}>
            已搞定 {stats.done}/{stats.total} 项
            {stats.missing > 0 && (
              <span style={{ color: C.seal }}>
                {"　"}· 还有 {stats.missing} 项标记为"还没"，请重点处理
              </span>
            )}
          </div>
        </div>

        {/* 步骤进度图 */}
        <div style={{ position: "relative", margin: "26px 0 24px" }}>
          <div
            style={{
              position: "absolute",
              top: 21,
              left: "7%",
              right: "7%",
              height: 2,
              background: C.line,
              zIndex: 0,
            }}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6,1fr)",
              position: "relative",
              zIndex: 1,
            }}
          >
            {STAGES.map((s, i) => {
              const p = stats.per[i];
              const isActive = i === active;
              const ring = p.ready
                ? s.accent
                : p.missing > 0
                ? C.seal
                : p.answered > 0
                ? C.gold
                : C.line;
              return (
                <button
                  key={s.key}
                  onClick={() => setActive(i)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 7,
                    padding: 0,
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      background: isActive ? s.accent : C.paper2,
                      border: `2px solid ${ring}`,
                      color: isActive ? "#fff" : ring === C.line ? C.inkSoft : ring,
                      fontFamily: serif,
                      fontSize: 18,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: isActive ? `0 4px 14px ${s.accent}40` : "none",
                      transition: "all .25s",
                    }}
                  >
                    {p.ready ? "✓" : s.num}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      lineHeight: 1.3,
                      color: isActive ? C.ink : C.inkSoft,
                      fontWeight: isActive ? 700 : 400,
                      textAlign: "center",
                      maxWidth: 96,
                    }}
                  >
                    {s.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 当前阶段 */}
        <div
          style={{
            background: C.paper2,
            border: `1px solid ${C.line}`,
            borderTop: `4px solid ${stage.accent}`,
            borderRadius: 12,
            padding: "24px 24px 10px",
            boxShadow: "0 8px 30px rgba(40,40,30,.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span
              style={{
                fontFamily: serif,
                fontSize: 13,
                color: stage.accent,
                border: `1px solid ${stage.accent}`,
                borderRadius: 20,
                padding: "2px 12px",
              }}
            >
              第 {stage.num} 步
            </span>
            <h2 style={{ fontFamily: serif, fontSize: 23, margin: 0, fontWeight: 700 }}>
              {stage.title}
            </h2>
            {stage.flag && (
              <span
                style={{
                  fontSize: 11,
                  color: "#fff",
                  background: C.seal,
                  borderRadius: 4,
                  padding: "2px 8px",
                  letterSpacing: 1,
                }}
              >
                {stage.flag}
              </span>
            )}
          </div>
          <div style={{ color: C.inkSoft, fontSize: 13.5, marginTop: 3 }}>{stage.subtitle}</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10, margin: "18px 0 4px" }}>
            <InfoRow tag="为什么准备" color={C.ink} bg="#f0ece1" text={stage.why} />
            <InfoRow tag="有什么好处" color={C.green} bg={C.greenSoft} text={stage.benefit} />
            <InfoRow tag="避免什么坑" color={C.seal} bg={C.sealSoft} text={stage.avoid} />
          </div>

          <div style={{ marginTop: 16 }}>
            <div
              style={{
                fontSize: 12.5,
                color: C.inkSoft,
                display: "flex",
                justifyContent: "space-between",
                borderBottom: `1px solid ${C.line}`,
                paddingBottom: 8,
                marginBottom: 4,
              }}
            >
              <span style={{ letterSpacing: 1 }}>本步要点</span>
              <span>
                {st.done}/{st.total} 搞定
                {st.missing > 0 && <span style={{ color: C.seal }}>{"　"}· {st.missing} 项还没</span>}
              </span>
            </div>

            {stage.items.map((it) => {
              const v = answers[it.id];
              const role = ROLE[it.role];
              return (
                <div key={it.id} style={{ padding: "14px 0", borderBottom: `1px dashed ${C.line}` }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ flex: "1 1 320px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span
                          style={{
                            fontSize: 10.5,
                            color: role.color,
                            background: role.bg,
                            border: `1px solid ${role.color}40`,
                            borderRadius: 4,
                            padding: "1px 7px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {role.label}
                        </span>
                        <span style={{ fontSize: 15, fontWeight: 600 }}>{it.label}</span>
                      </div>
                      <div style={{ fontSize: 13, color: C.inkSoft, lineHeight: 1.65, marginTop: 4 }}>
                        {it.hint}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      {Object.entries(STATUS).map(([k, s]) => {
                        const on = v === k;
                        return (
                          <button
                            key={k}
                            onClick={() => setAnswer(it.id, k)}
                            style={{
                              cursor: "pointer",
                              fontSize: 12.5,
                              padding: "6px 11px",
                              borderRadius: 6,
                              border: `1px solid ${on ? s.color : C.line}`,
                              background: on ? s.color : "transparent",
                              color: on ? "#fff" : C.inkSoft,
                              fontWeight: on ? 600 : 400,
                              transition: "all .15s",
                            }}
                          >
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {v === "missing" && (
                    <div
                      style={{
                        marginTop: 10,
                        background: C.sealSoft,
                        border: `1px solid ${C.seal}55`,
                        borderLeft: `3px solid ${C.seal}`,
                        borderRadius: 6,
                        padding: "10px 12px",
                        fontSize: 13,
                        lineHeight: 1.7,
                        color: "#7a2517",
                      }}
                    >
                      <strong style={{ color: C.seal }}>⚠ 没做的后果：</strong>
                      {it.consequence}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {stage.key === "dd" && (
            <div style={{ marginTop: 16, marginBottom: 8 }}>
              <button
                onClick={() => setShowQs((s) => !s)}
                style={{
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                  background: "#2a2c25",
                  color: C.paper,
                  border: "none",
                  borderRadius: 8,
                  padding: "12px 16px",
                  fontSize: 14,
                  fontFamily: serif,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>📋 投资人尽调常问的 10 个问题（点击{showQs ? "收起" : "展开"}）</span>
                <span>{showQs ? "▲" : "▼"}</span>
              </button>
              {showQs && (
                <ol
                  style={{
                    margin: "10px 0 0",
                    paddingLeft: 22,
                    fontSize: 13.5,
                    lineHeight: 1.9,
                    color: C.ink,
                  }}
                >
                  {INVESTOR_QS.map((q, i) => (
                    <li key={i} style={{ marginBottom: 2 }}>
                      {q}
                    </li>
                  ))}
                </ol>
              )}
              <p style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 10, lineHeight: 1.7 }}>
                你现在不必逐条写答复，但要确保前五步的材料能支撑这些答案。答不上来，投资人不会当成小瑕疵，而会怀疑公司治理与合规能力。
              </p>
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
          <NavBtn disabled={active === 0} onClick={() => setActive((a) => Math.max(0, a - 1))}>
            ← 上一步
          </NavBtn>
          <NavBtn
            disabled={active === STAGES.length - 1}
            primary
            onClick={() => setActive((a) => Math.min(STAGES.length - 1, a + 1))}
          >
            下一步 →
          </NavBtn>
        </div>

        <div
          style={{
            marginTop: 26,
            background: "#2a2c25",
            color: C.paper,
            borderRadius: 12,
            padding: "20px 22px",
          }}
        >
          <div style={{ fontFamily: serif, fontSize: 16, marginBottom: 12, color: "#e9e2cf" }}>
            投资人怎么给问题分级（自检用）
          </div>
          {RISK.map(([lv, txt, col]) => (
            <div key={lv} style={{ display: "flex", gap: 12, marginBottom: 9, alignItems: "flex-start" }}>
              <span
                style={{
                  flexShrink: 0,
                  fontSize: 12,
                  background: col,
                  color: "#fff",
                  borderRadius: 4,
                  padding: "2px 10px",
                  marginTop: 2,
                  minWidth: 40,
                  textAlign: "center",
                }}
              >
                {lv}
              </span>
              <span style={{ fontSize: 13.5, lineHeight: 1.7, color: "#d9d3c2" }}>{txt}</span>
            </div>
          ))}
          <p
            style={{
              marginTop: 14,
              paddingTop: 14,
              borderTop: "1px solid #43453b",
              fontSize: 14,
              lineHeight: 1.8,
              color: "#f0ead8",
              fontFamily: serif,
            }}
          >
            记住这句：投资人真正怕的，不是企业有税要交，而是企业不知道自己有没有税、什么时候交、谁来交、依据是什么。税务成本可以测算，
            <strong style={{ color: "#fff" }}>税务不确定性才是融资杀手</strong>。
          </p>
        </div>

        <div style={{ textAlign: "center", marginTop: 22, fontSize: 12, color: C.inkSoft, lineHeight: 1.7 }}>
          进度会自动保存。政策依据：职务科技成果赋权改革（先确权后转化）、技术入股递延纳税 财税〔2016〕101号及总局公告2016年第62号。
          <br />各校流程与比例不同，具体请以本校成果转化办公室及专业税务/法律意见为准。
        </div>
      </div>
    </div>
  );
}

function InfoRow({ tag, color, bg, text }) {
  return (
    <div
      style={{
        background: bg,
        borderRadius: 8,
        padding: "11px 14px",
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
      }}
    >
      <span
        style={{
          flexShrink: 0,
          fontSize: 12,
          fontWeight: 700,
          color,
          fontFamily: serif,
          minWidth: 60,
          marginTop: 1,
        }}
      >
        {tag}
      </span>
      <span style={{ fontSize: 13.5, lineHeight: 1.75, color: "#33342c" }}>{text}</span>
    </div>
  );
}

function NavBtn({ children, onClick, disabled, primary }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.35 : 1,
        background: primary ? C.green : "transparent",
        color: primary ? "#fff" : C.ink,
        border: primary ? "none" : `1px solid ${C.line}`,
        borderRadius: 8,
        padding: "10px 22px",
        fontSize: 14,
        fontFamily: serif,
      }}
    >
      {children}
    </button>
  );
}
