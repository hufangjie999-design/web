/* ============================================================
 * 作品数据（唯一需要你手动维护的文件）
 * ------------------------------------------------------------
 * 中英双语：中文用原字段名，英文用同名 + _en（例如 title / title_en）。
 *   英文缺失时页面自动回退到中文，不会出现空白。
 *
 * 日常维护：
 *   - 加作品：复制一个 { ... } 块，改 id / title / title_en / 图片路径
 *   - 改文案：直接改字符串
 *   - 隐藏作品：把 visible 改成 false
 *   - 加视频：填 videos[].url（支持 B 站 / YouTube / mp4 直链）
 *
 * 图片路径规则：图片写在 作品集/ 下，形如 '产品设计/01-子母机概念板'（不含扩展名），
 *   网站优先用 assets/img/ 里的压缩图，缺了就回退到原始素材。
 * ============================================================ */

/* ---------- 站点与个人信息 ---------- */
const SITE = {
  name: '胡方杰',
  brand: '设计作品集',
  positioning: '产品设计 · 视觉传达 · 数字媒体',
  title: '胡方杰 · 设计作品集',
  heroTitle: '把复杂的问题<br>做成简单好用的东西<em>。</em>',
  heroLede: '我是胡方杰。这里收录我在产品设计、视觉传达与数字媒体方向的精选作品，从概念、建模到落地实现。',
  about: ['我做产品设计、视觉传达与数字媒体三个方向，习惯把一个想法从概念草图一路推到可展示、可落地的成品。', '在工业设计中关注结构与形态的配合；在视觉与界面设计中关注信息怎么清晰地传达出去。'],
  skills: ['产品设计', '视觉传达', '数字媒体', 'SolidWorks', 'Illustrator', 'Figma'],
  timeline: [
    {
      year: '2025',
      text: '子母机 / 潜水器概念方案与结构建模'
    },
    {
      year: '2024–25',
      text: '产品设计 / 视觉传达 / 数字媒体 多方向创作'
    },
    {
      year: '教育',
      text: '飞行器动力工程（待补充）'
    }
  ],
  contact: {
    email: '12345678',
    wechat: '待补充',
    resume: 'resume.pdf'
  },
  particles: {
    density: 9500,
    maxCount: 200,
    minCount: 80,
    linkDistance: 17000
  },
  heroTitle_en: 'Turning complex problems<br>into simple, usable things<em>.</em>',
  heroLede_en: 'I’m Hu Fangjie. A selection of my work across product design, visual communication and digital media — from concept and CAD to finished output.',
  positioning_en: 'Product Design · Visual Communication · Digital Media',
  about_en: [
    'I work across product design, visual communication and digital media, and I like to take an idea from first sketch all the way to something presentable and buildable.',
    'In industrial design I focus on how structure and form work together; in visual and interface design, on how clearly information gets across.'
  ],
  skills_en: [
    'Product Design',
    'Visual Communication',
    'Digital Media',
    'SolidWorks',
    'Illustrator',
    'Figma'
  ],
  timeline_en: [
    {
      year: '2025',
      text: 'Mother-ship / submersible concept design and structural modelling'
    },
    {
      year: '2024–25',
      text: 'Product design, visual communication and digital media projects'
    },
    {
      year: 'Education',
      text: 'Aircraft Power Engineering (to be updated)'
    }
  ]
};

/* ---------- 作品分类（中文原值，英文显示名由 i18n.js 提供） ---------- */
const CATEGORIES = ['产品设计', '视觉传达', '数字媒体'];

/* ---------- 作品列表 ---------- */
const WORKS = [
  {
    id: 'ziguji',
    title: '子母机概念方案',
    title_en: 'Mother–Daughter Craft Concept',
    category: '产品设计',
    year: 2025,
    role: '独立设计 · 结构建模',
    role_en: 'Sole designer · structural modelling',
    tools: ['SolidWorks', 'KeyShot'],
    duration: '6 周',
    duration_en: '6 weeks',
    summary: '面向复杂作业场景的可分离式平台：母机负责续航与载荷，子机负责精细作业，两者可独立运行也可协同。',
    summary_en: 'A separable platform for complex operations: the mother craft carries power and payload, the daughter craft handles fine work. They can run independently or in tandem.',
    cover: '产品设计/01-子母机概念板',
    hero: '产品设计/01-子母机概念板',
    featured: true,
    visible: true,
    keywords: ['子母机', '工业设计', '概念', '结构', '建模'],
    keywords_en: ['drone', 'industrial design', 'concept', 'structure', 'CAD'],
    background: '既有方案在续航与精细作业能力之间总是二选一：续航长的平台体积大、难以进入狭窄空间；灵活的机体又撑不住长时间任务。本项目要回答的问题是：能否用一套可分离的组合结构，让同一套装备同时覆盖两种工况？',
    background_en: 'Existing platforms force a trade-off between endurance and fine manipulation: long-endurance craft are bulky and cannot enter tight spaces, while nimble ones cannot sustain long missions. This project asks whether one separable assembly can cover both operating conditions.',
    approach: [
      '形态发散：先做 6 组形态草图，收敛到"上下嵌套 + 侧向锁止"的主结构。',
      '结构验证：在 SolidWorks 中建立装配体，检查锁止机构与线缆走线的干涉。',
      '外观定稿：以功能分色区分母机与子机，减少视觉噪音。'
    ],
    approach_en: [
      'Form exploration: six sketch directions, narrowed down to a “nested stack + side locking” structure.',
      'Structural check: built the assembly in SolidWorks and inspected interference between the lock and cable routing.',
      'Final look: functional colour separation between mother and daughter craft to reduce visual noise.'
    ],
    process: [
      {
        img: '产品设计/02-潜水器外观渲染',
        caption: '外观方案迭代',
        caption_en: 'Exterior iteration'
      },
      {
        img: '产品设计/03-装备结构爆炸图',
        caption: '锁止机构与装配关系',
        caption_en: 'Locking mechanism and assembly'
      }
    ],
    results: [
      {
        img: '产品设计/01-子母机概念板',
        caption: '最终概念板',
        caption_en: 'Final concept board'
      },
      {
        img: '产品设计/04-装配工程图',
        caption: '装配工程图',
        caption_en: 'Assembly drawing'
      },
      {
        img: '产品设计/05-形态草图',
        caption: '形态推敲草图',
        caption_en: 'Form study sketches'
      }
    ],
    outcome: '方案完成外观与结构建模，形成可展示的渲染图与爆炸图，作为后续竞赛材料的核心视觉与结构依据。',
    outcome_en: 'The concept was modelled in full — exterior and structure — producing renders and exploded views that later became the core visuals and structural basis for competition entries.',
    metrics: [
      {
        value: '6 周',
        label: '从草图到定稿'
      },
      {
        value: '3 轮',
        label: '结构迭代'
      },
      {
        value: '1 套',
        label: '可复用装配体'
      }
    ],
    metrics_en: [
      {
        value: '6 weeks',
        label: 'sketch to final'
      },
      {
        value: '3 rounds',
        label: 'structural iterations'
      },
      {
        value: '1 assembly',
        label: 'reusable model'
      }
    ]
  },
  {
    id: 'qianshuiqi',
    title: '潜水器外观设计',
    title_en: 'Submersible Exterior Design',
    category: '产品设计',
    year: 2025,
    role: '外观设计 · 渲染',
    role_en: 'Exterior design · rendering',
    tools: ['SolidWorks', 'Photoshop'],
    duration: '4 周',
    duration_en: '4 weeks',
    summary: '以流线型外壳降低水阻，观察窗与双推进器在视觉上形成平衡，兼顾功能分区与整体感。',
    summary_en: 'A streamlined shell reduces drag, while the viewport and twin thrusters balance each other visually — functional zones stay legible without losing overall coherence.',
    cover: '产品设计/02-潜水器外观渲染',
    hero: '产品设计/02-潜水器外观渲染',
    featured: false,
    visible: true,
    keywords: ['潜水器', '水下', '外观', '渲染'],
    keywords_en: ['submersible', 'underwater', 'exterior', 'rendering'],
    background: '水下作业装备的外观长期被"功能优先"主导，形体粗暴、色彩杂乱，操作者难以快速识别设备状态。本项目尝试在成本可控的前提下，让外观同时承担功能提示的作用。',
    background_en: 'Underwater equipment has long been designed function-first: blunt forms and cluttered colours make it hard for operators to read a machine’s state at a glance. This project explores how exterior design can double as functional signalling at controlled cost.',
    approach: ['形体：以两端收窄的胶囊体降低水阻，保证内部载荷空间。', '分件：观察窗、推进器、鳍面分别用不同材质与色阶区分。', '标注：关键操作面用统一色带提示，减少误操作。'],
    approach_en: [
      'Form: a capsule body tapered at both ends to cut drag while keeping internal payload space.',
      'Parting: viewport, thrusters and fins separated by material and tone.',
      'Signage: a consistent colour band marks key operating surfaces to reduce mis-operation.'
    ],
    process: [
      {
        img: '产品设计/05-形态草图',
        caption: '前期形态草图',
        caption_en: 'Early form sketches'
      }
    ],
    results: [
      {
        img: '产品设计/02-潜水器外观渲染',
        caption: '最终外观渲染',
        caption_en: 'Final exterior render'
      },
      {
        img: '产品设计/06-方案对比草图',
        caption: '三方案对比',
        caption_en: 'Three-direction comparison'
      }
    ],
    outcome: '完成外观渲染与多角度视图，水阻系数较初版方案降低约 18%。',
    outcome_en: 'Delivered exterior renders and multi-angle views; the drag coefficient came down by roughly 18% versus the first iteration.',
    metrics: [
      {
        value: '18%',
        label: '水阻系数降低'
      },
      {
        value: '4 周',
        label: '设计周期'
      }
    ],
    metrics_en: [
      {
        value: '18%',
        label: 'drag reduction'
      },
      {
        value: '4 weeks',
        label: 'design cycle'
      }
    ]
  },
  {
    id: 'poster-shanhai',
    title: '《山海之间》设计展主视觉',
    title_en: '“Between Mountains and Sea” — Exhibition Key Visual',
    category: '视觉传达',
    year: 2025,
    role: '主视觉设计',
    role_en: 'Key visual design',
    tools: ['Illustrator', 'Photoshop'],
    duration: '2 周',
    duration_en: '2 weeks',
    summary: '为校内设计展设计主视觉，用同心圆象征时间的层积，冷色渐变传达"山海"的空间纵深。',
    summary_en: 'Key visual for a campus design exhibition: concentric circles suggest accumulated time, while a cool gradient conveys the depth of “mountains and sea”.',
    cover: '视觉传达/01-活动主视觉海报',
    hero: '视觉传达/01-活动主视觉海报',
    featured: true,
    visible: true,
    keywords: ['海报', '主视觉', '展览', '设计展', '平面'],
    keywords_en: ['poster', 'key visual', 'exhibition', 'graphic design'],
    background: '展览主题是"山海之间"，需要一张既能撑住 600×900mm 实体海报、也能缩到手机屏幕上不糊的主视觉。',
    background_en: 'The theme was “Between Mountains and Sea”. The key visual had to hold up both as a 600×900 mm printed poster and as a thumbnail on a phone screen.',
    approach: ['图形：以同心圆作为主形，象征地质层积与时间。', '配色：深青到墨蓝的渐变，避免高饱和色印刷偏色。', '信息层级：标题占画面下三分之一，保证远距离可读。'],
    approach_en: [
      'Graphic: concentric circles as the main form, echoing geological strata and time.',
      'Colour: a deep teal-to-indigo gradient, avoiding the colour shift high-saturation inks cause in print.',
      'Hierarchy: the title sits in the lower third so it stays readable from a distance.'
    ],
    process: [],
    results: [
      {
        img: '视觉传达/01-活动主视觉海报',
        caption: '主视觉成品',
        caption_en: 'Final key visual'
      },
      {
        img: '视觉传达/04-展览海报系列',
        caption: '系列延展',
        caption_en: 'Series extension'
      }
    ],
    outcome: '主视觉用于展览海报、门票与线上宣传图，并延展出系列化的色彩应用。',
    outcome_en: 'The key visual was used across posters, tickets and online promotion, and extended into a systematic colour application.',
    metrics: [
      {
        value: '3 套',
        label: '尺寸适配'
      },
      {
        value: '2 周',
        label: '设计周期'
      }
    ],
    metrics_en: [
      {
        value: '3 sizes',
        label: 'format adaptations'
      },
      {
        value: '2 weeks',
        label: 'design cycle'
      }
    ]
  },
  {
    id: 'brand-hf',
    title: 'HF 品牌视觉规范',
    title_en: 'HF Brand Guidelines',
    category: '视觉传达',
    year: 2024,
    role: '品牌设计',
    role_en: 'Brand design',
    tools: ['Illustrator'],
    duration: '3 周',
    duration_en: '3 weeks',
    summary: '为一组设计作品建立统一的视觉识别系统，包含色板、标志正负形与字体规范。',
    summary_en: 'A minimal identity system for a body of design work: colour palette, logo in positive and negative form, and type specifications.',
    cover: '视觉传达/02-品牌视觉规范',
    hero: '视觉传达/02-品牌视觉规范',
    featured: false,
    visible: true,
    keywords: ['VI', '标志', 'logo', '品牌', '规范'],
    keywords_en: ['identity', 'logo', 'brand', 'guidelines'],
    background: '多个作品分散在不同媒介上，风格零散。需要一套最小可用的识别系统把这些作品收拢成一个整体。',
    background_en: 'The work was spread across different media with no shared visual language. A minimal identity system was needed to hold it together as one body of work.',
    approach: ['色彩：确定主色、辅助色、点缀色、背景色、文字色五色体系。', '标志：以姓名首字母构成，同时给出正形与负形两种用法。', '字体：规定标题与正文的字重与字号关系。'],
    approach_en: [
      'Colour: a five-part system — primary, secondary, accent, background and text.',
      'Logo: built from the designer’s initials, with positive and negative variants.',
      'Type: defined weight and size relationships between headings and body text.'
    ],
    process: [],
    results: [
      {
        img: '视觉传达/02-品牌视觉规范',
        caption: '规范页',
        caption_en: 'Guidelines page'
      }
    ],
    outcome: '形成可复用的规范页，后续海报与界面均沿用这套色板。',
    outcome_en: 'Produced a reusable guidelines page; later posters and interfaces all draw on the same palette.',
    metrics: [
      {
        value: '5 色',
        label: '色彩体系'
      }
    ],
    metrics_en: [
      {
        value: '5 colours',
        label: 'palette system'
      }
    ]
  },
  {
    id: 'infographic',
    title: '项目构成信息图',
    title_en: 'Portfolio Composition Infographic',
    category: '视觉传达',
    year: 2024,
    role: '信息设计',
    role_en: 'Information design',
    tools: ['Illustrator', 'Figma'],
    duration: '1 周',
    duration_en: '1 week',
    summary: '把作品集的构成数据做成信息图：环形图看占比，柱状图看时间分布。',
    summary_en: 'Portfolio data as a single graphic: a donut for category share, a bar chart for output over time.',
    cover: '视觉传达/03-信息图表设计',
    hero: '视觉传达/03-信息图表设计',
    featured: false,
    visible: true,
    keywords: ['信息图', '图表', '数据', '可视化'],
    keywords_en: ['infographic', 'chart', 'data', 'visualisation'],
    background: '作品数量与方向分布适合用一张图讲清楚，比纯文字列表更容易被记住。',
    background_en: 'The number of projects and their distribution across fields is easier to grasp in one image than in a text list — and far more memorable.',
    approach: ['对比：环形图表达三类作品的占比关系。', '趋势：柱状图表达各年度产出量。', '配色：沿用品牌色板，保证与整站一致。'],
    approach_en: [
      'Comparison: a donut communicates each category’s share.',
      'Trend: a bar chart shows annual output.',
      'Colour: drawn from the brand palette so it matches the rest of the site.'
    ],
    process: [],
    results: [
      {
        img: '视觉传达/03-信息图表设计',
        caption: '信息图成品',
        caption_en: 'Final infographic'
      }
    ],
    outcome: '用于作品集首页的"数据一览"区块。',
    outcome_en: 'Used in the “at a glance” section of the portfolio home page.',
    metrics: [
      {
        value: '2 类',
        label: '图表类型'
      }
    ],
    metrics_en: [
      {
        value: '2 chart types',
        label: 'donut + bars'
      }
    ]
  },
  {
    id: 'app-task',
    title: '任务管理 App 界面',
    title_en: 'Task Manager App',
    category: '数字媒体',
    year: 2025,
    role: 'UI 设计 · 交互原型',
    role_en: 'UI design · interactive prototype',
    tools: ['Figma'],
    duration: '3 周',
    duration_en: '3 weeks',
    summary: '面向设计项目协作的任务管理应用，重点解决"待处理项看不清优先级"的问题。',
    summary_en: 'A task manager for design collaboration, built around one problem: you cannot tell what to do first from a flat list.',
    cover: '数字媒体/01-移动端界面设计',
    hero: '数字媒体/01-移动端界面设计',
    featured: true,
    visible: true,
    keywords: ['App', 'UI', '界面', '移动端', '原型'],
    keywords_en: ['app', 'UI', 'interface', 'mobile', 'prototype'],
    background: '原有工具把任务平铺成一条长列表，用户需要反复滚动才能判断今天该先做什么。',
    background_en: 'Existing tools flatten tasks into one long list, forcing users to scroll repeatedly just to decide what to do first today.',
    approach: ['信息层级：顶部固定"进行中 / 已完成"两个数字卡，先给结论。', '列表：每条任务用色块标出所属环节，扫视即可分辨类型。', '操作：底部四个入口，常用操作不超过一次点击。'],
    approach_en: [
      'Hierarchy: two counters (“in progress” / “done”) sit at the top, so the answer comes first.',
      'List: each row carries a colour block for its stage, so scanning is enough to tell types apart.',
      'Actions: four bottom entries; nothing common takes more than one tap.'
    ],
    process: [],
    results: [
      {
        img: '数字媒体/01-移动端界面设计',
        caption: '主界面',
        caption_en: 'Main screen'
      },
      {
        img: '数字媒体/04-交互原型界面',
        caption: '参数配置面板',
        caption_en: 'Parameter panel'
      }
    ],
    outcome: '完成高保真界面与可点击原型，覆盖任务列表、详情与状态切换主流程。',
    outcome_en: 'Delivered high-fidelity screens and a clickable prototype covering the list, detail and status-change flows.',
    metrics: [
      {
        value: '3 周',
        label: '设计周期'
      },
      {
        value: '12 屏',
        label: '高保真界面'
      }
    ],
    metrics_en: [
      {
        value: '3 weeks',
        label: 'design cycle'
      },
      {
        value: '12 screens',
        label: 'high fidelity'
      }
    ]
  },
  {
    id: 'dashboard',
    title: '设计项目监测大屏',
    title_en: 'Project Monitoring Dashboard',
    category: '数字媒体',
    year: 2025,
    role: '可视化设计',
    role_en: 'Data visualisation design',
    tools: ['Figma', 'ECharts'],
    duration: '2 周',
    duration_en: '2 weeks',
    summary: '把项目进度与质量指标放到一块大屏上，让评审时不用再翻文档。',
    summary_en: 'Project progress and quality metrics on one screen, so reviews no longer stall while someone looks things up.',
    cover: '数字媒体/02-数据可视化大屏',
    hero: '数字媒体/02-数据可视化大屏',
    featured: false,
    visible: true,
    keywords: ['大屏', '仪表盘', '看板', '数据'],
    keywords_en: ['dashboard', 'monitoring', 'data', 'KPI'],
    background: '项目评审时数据分散在多个文档里，讨论经常被打断在"现在到哪一步了"。',
    background_en: 'Review meetings kept getting interrupted by “where are we now?” because the data lived in several separate documents.',
    approach: ['首屏三个 KPI 直接给结论：样本量、准确率、响应时间。', '趋势用折线，构成用环形，避免让读者自己换算。', '深色底降低长时间观看的疲劳。'],
    approach_en: [
      'Three KPIs lead: sample size, accuracy, response time — conclusions before detail.',
      'Trend as a line, composition as a donut, so readers never have to convert units themselves.',
      'A dark background reduces eye strain over long sessions.'
    ],
    process: [],
    results: [
      {
        img: '数字媒体/02-数据可视化大屏',
        caption: '大屏成品',
        caption_en: 'Final dashboard'
      }
    ],
    outcome: '用于每周评审会的固定看板，把"查数据"的时间省下来讨论方案。',
    outcome_en: 'Adopted as the standing board for weekly reviews, reclaiming the time previously spent hunting for numbers.',
    metrics: [
      {
        value: '3 项',
        label: '核心 KPI'
      },
      {
        value: '2 周',
        label: '设计周期'
      }
    ],
    metrics_en: [
      {
        value: '3 KPIs',
        label: 'at a glance'
      },
      {
        value: '2 weeks',
        label: 'design cycle'
      }
    ]
  },
  {
    id: 'video-animation',
    title: '方案演示动画封面',
    title_en: 'Product Demo Animation — Cover & Titles',
    category: '数字媒体',
    year: 2024,
    role: '动效设计',
    role_en: 'Motion design',
    tools: ['After Effects'],
    duration: '1 周',
    duration_en: '1 week',
    summary: '产品演示动画的封面与片头设计，用同心弧线暗示机械运动轨迹。',
    summary_en: 'Cover and title sequence for a product demo animation; concentric arcs hint at the mechanism’s motion path.',
    cover: '数字媒体/03-动态演示视频封面',
    hero: '数字媒体/03-动态演示视频封面',
    featured: false,
    visible: true,
    keywords: ['视频', '动画', '动效', '演示'],
    keywords_en: ['video', 'animation', 'motion', 'demo'],
    background: '演示视频需要一个能在静帧状态下就传达"这是一段产品动画"的封面。',
    background_en: 'The demo needed a cover that reads as “this is a product animation” even as a still frame.',
    approach: ['用播放键作为视觉锚点，保证缩略图尺寸下也能识别。', '弧线轨迹与产品运动路径对应，不是纯装饰。', '标题压在底部渐隐区，避免遮挡主画面。'],
    approach_en: [
      'A play button acts as the visual anchor, so the cover still reads at thumbnail size.',
      'The arc trajectories correspond to the product’s actual motion path — decoration with a reason.',
      'Titles sit in the bottom fade so the main image stays clear.'
    ],
    process: [],
    results: [
      {
        img: '数字媒体/03-动态演示视频封面',
        caption: '封面成品',
        caption_en: 'Cover design'
      }
    ],
    outcome: '用于方案汇报视频的封面与片头，时长 2 分 14 秒。',
    outcome_en: 'Used as the cover and title sequence for a 2:14 project presentation video.',
    metrics: [
      {
        value: '02:14',
        label: '成片时长'
      }
    ],
    metrics_en: [
      {
        value: '02:14',
        label: 'final runtime'
      }
    ],
    videos: [
      {
        url: '',
        poster: '数字媒体/03-动态演示视频封面',
        caption: '把 url 换成真实视频地址后，点击封面即可在页内播放',
        caption_en: 'Add a real video URL to play it inline',
        title: '方案演示动画 · 正片',
        title_en: 'Product demo animation — full film'
      }
    ]
  }
];

/* 导出给浏览器使用（保持纯静态，不依赖模块系统） */
window.SITE = SITE;
window.CATEGORIES = CATEGORIES;
window.WORKS = WORKS;
