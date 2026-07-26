import {
  housingFacets,
  housingRooms,
  residenceById,
  residences,
  roommateById,
} from "../data/housing.js";
import { recordCampusEvent } from "./campus-ledger.js";
import { getLocale } from "./i18n.js";
import {
  acceptHousingOffer,
  activeHousingAssignment,
  cancelHousingRoomChange,
  clearHousingDraft,
  confirmHousingAgreement,
  declineHousingOffer,
  housingApplications,
  housingDraft,
  housingIdentity,
  housingRoomChanges,
  latestHousingApplication,
  roomForAssignment,
  saveHousingDraft,
  submitHousingApplication,
  submitHousingRoomChange,
} from "./housing-model.js";
import { renderPreservingState } from "./render-state.js";
import { showToast } from "./ui.js";
import { safeDecodeFragment } from "./url-state.js";

const copy = {
  "zh-Hant": {
    eyebrow: "RESIDENTIAL LIFE / 宿舍生活",
    title: "房間會分配，生活得一起協商。",
    lead: "比較五座宿舍，填寫月相、翼展、水域、使魔與作息需求；住宿委員會會給出三份房間方案，把合拍之處和可能吵起來的地方都寫清楚。",
    term: "2026 秋季入住",
    residences: "宿舍",
    openBeds: "目前空床",
    monthlyFrom: "最低月宿費",
    tabs: ["宿舍總覽", "申請與配對", "我的宿舍"],
    overview: "五座宿舍，五種回房方法。",
    overviewLead: "先選宿舍查看房型、空床、設備與舍監公告。選中的門牌可以直接分享。",
    details: "宿舍檔案",
    roomTypes: "本期可申請房間",
    features: "共用設備",
    warden: "舍監與管理",
    notice: "釘在門上的公告",
    distance: "到校路線",
    beds: "床",
    open: "空",
    month: "円／月",
    applyHere: "以此宿舍為第一志願",
    applicationTitle: "住宿需求申請",
    applicationLead: "這不是性格測驗。它只用來找到能睡、能回房，也比較不容易在滿月凌晨因一把椅子開會的組合。",
    identityNeeded: "需要先建立 My TU 身分，住宿委員會才知道要把房號寫給誰。宿舍檔案仍可自由查看。",
    createIdentity: "建立 My TU 身分",
    applicant: "申請人",
    firstResidence: "第一志願宿舍",
    secondResidence: "第二志願宿舍",
    roomType: "希望房型",
    anyRoom: "任何房型",
    budget: "每月宿費上限",
    habits: "共同生活與身體需求",
    sleep: "主要睡眠時段",
    noise: "房內聲量",
    cleanliness: "整理方式",
    cooking: "使用廚房",
    moon: "月相反應",
    water: "水域需求",
    flight: "飛行／翼展",
    wall: "牆面使用",
    familiar: "使魔空間",
    danmaku: "室內彈幕",
    note: "還有什麼一定要先說",
    notePlaceholder: "例如：行李箱會在週三變成較大的行李箱；不接受會偷早餐的室友。",
    draft: "表單會自動保存在這台裝置。",
    submit: "送交住宿委員會",
    clear: "清除草稿",
    draftSaved: "住宿需求草稿已留在這台裝置。",
    submitted: "申請已送出，三份分房建議已放上桌。",
    applicationRef: "住宿申請",
    applicationHistory: "本機住宿申請紀錄",
    chooseApplication: "查看一份住宿申請",
    matchingTitle: "住宿委員會的三份建議",
    matchingLead: "分數不是友情保證。它表示房間設備、生活習慣與你的需求重疊到什麼程度；摩擦點會保留給你判斷。",
    score: "相容",
    matchedWith: "同住者",
    noRoommate: "本期單人室",
    fit: "為什麼合適",
    friction: "先談清楚",
    accept: "接受這份房間",
    decline: "略過這份",
    accepted: "房間已接受，入住資料已寫入「我的宿舍」。",
    allocationClosed: "本份申請已完成分房",
    declined: "這份建議已略過；委員會沒有偷偷把它放回最上面。",
    allDeclined: "三份建議都已略過。你可以改寫需求，讓委員會重新配對。",
    newApplication: "重新填寫需求",
    accountTitle: "我的宿舍",
    accountLead: "房號、室友協議、入住備忘與換房請求都留在這台裝置。",
    noAssignment: "尚未接受房間。先完成需求申請，再從住宿委員會的建議中選一份。",
    goApplication: "前往申請與配對",
    activeRoom: "目前房間",
    roommateFile: "室友小檔案",
    fee: "月宿費",
    acceptedOn: "接受日期",
    moveIn: "入住日",
    moveInDate: "2026 年 9 月 6 日・日落前",
    agreement: "共住協議",
    agreementLead: "委員會依兩邊的需求生成了四條先談好的規則。勾選只代表你在本機看過；不代表室友已經同意不偷早餐。",
    agreementCheck: "我已閱讀這份共住備忘",
    agreementSaved: "共住備忘狀態已更新。",
    roomChange: "換房申請",
    roomChangeLead: "說明現在真正發生的問題。委員會會先保留原房，再附上一份可行替代，不會讓你的床位突然消失。",
    reason: "主要原因",
    urgency: "處理時限",
    changeNote: "具體情況",
    sendChange: "送出換房請求",
    changeSent: "換房請求已保存；原房間仍然有效。",
    changeHistory: "換房請求紀錄",
    cancelChange: "撤回請求",
    changeCancelled: "換房請求已撤回。",
    suggestion: "委員會暫列替代",
    status: { "under-review": "審查中", cancelled: "已撤回" },
    reasons: {
      firstResidence: "第一志願宿舍",
      secondResidence: "第二志願宿舍",
      roomType: "符合希望房型",
      withinBudget: "在宿費上限內",
      sleepMatch: "睡眠時段接近",
      noiseMatch: "房內聲量習慣一致",
      cleanlinessMatch: "整理節奏相近",
      cookingMatch: "廚房使用時段相容",
      moonProtected: "有遮月與低刺激設備",
      waterAccess: "能直接接近水域",
      waterNearby: "水域距離合適",
      wingSpace: "翼展回旋空間足夠",
      flightStorage: "有飛具收納",
      phaseSafe: "牆面穿越標線完整",
      familiarWelcome: "大型使魔有獨立位置",
      familiarBay: "小型使魔有休息格",
      blastDesk: "室內實驗有耐爆工作桌",
      quietWard: "夜間靜音結界",
      singleRoom: "不必協調固定室友",
    },
    frictions: {
      sleepConflict: "睡眠時段需要先訂安靜時間",
      noiseConflict: "對房內聲量的容忍不同",
      cleanlinessConflict: "整理標準可能正面相撞",
      moonConflict: "滿月作息反應不同",
      waterConflict: "水域使用習慣不同",
      flightConflict: "窗邊與起飛動線需分配",
      wallConflict: "對『門』與『牆』的定義不同",
      familiarConflict: "使魔可使用的家具要先寫名",
      danmakuConflict: "室內彈幕界線不同",
      moonUnshielded: "沒有完整遮月設備",
      waterMissing: "房間不直接連接水域",
      wingTight: "大翼展轉身空間有限",
      phaseUnmarked: "牆面未標記安全穿越線",
      familiarCrowded: "大型使魔位置偏擠",
      danmakuOutside: "彈幕練習須移到室外",
      roomTypeDifferent: "不是原先希望的房型",
      overBudget: "高於填寫的宿費上限",
    },
    incidents: {
      doorName: "門牌必須同時寫房號與兩位住戶姓名；若房號自行改變，以姓名為準。",
      singleVisitor: "單人室訪客不得以『臨時室友』名義連住三夜；第四夜起會收到床位申請表。",
      quietHours: "兩邊睡眠時段不同：每日安靜時段先寫在門板，臨時更改須在晚飯前。",
      nightKitchen: "深夜使用廚房須保留一盞紅燈，不得讓鍋子代替鬧鐘。",
      fullMoon: "滿月前後三夜，以需要低刺激的一方為準；談話室負責接收另一方的活動量。",
      familiarChair: "使魔與家具不是先到先得；窗邊椅的使用表每週重排一次。",
      wallKnock: "穿牆前敲三下。敲的是牆還是門不影響三下這個數字。",
      waterSchedule: "室內水道每日 06:00 清障；個人物品不得被稱作『臨時水利設施』。",
      windowRunway: "窗邊起飛動線保持淨空；晾衣繩高度由翼展較大者先試。",
      danmakuTape: "紅膠帶內才算耐爆區。把膠帶往外移動不會讓房間跟著變大。",
    },
    options: {
      sleep: { early: "早睡早起", late: "夜行", shifting: "輪班／不固定" },
      noise: { quiet: "偏安靜", social: "能接受談話與音樂" },
      cleanliness: { neat: "物品需歸位", relaxed: "看得見地板即可" },
      cooking: { no: "很少使用", shared: "正常共用", night: "常在深夜使用" },
      moon: { ordinary: "無特別反應", sensitive: "需要遮月／低刺激", active: "滿月時更活躍" },
      water: { dry: "一般乾燥房間", near: "希望靠近水", must: "必須直接接水域" },
      flight: { ground: "不需飛行空間", small: "掃帚／小翼展", large: "大翼展" },
      wall: { solid: "只使用門", phase: "需要穿牆標線" },
      familiar: { none: "沒有固定使魔", small: "小型使魔", large: "大型／多隻使魔" },
      danmaku: { none: "不在室內練習", outdoors: "只在室外練習", indoor: "需要耐爆室內區" },
      reasons: { schedule: "作息與噪音", moon: "月相／感官需求", water: "水域或身體需求", familiar: "使魔／空間不足", conflict: "共同生活衝突", route: "通學路線", other: "其他" },
      urgency: { ordinary: "一般審查", soon: "七日內", immediate: "需要當日聯絡" },
    },
  },
  ja: {
    eyebrow: "RESIDENTIAL LIFE / 学寮生活", title: "部屋は配分できても、生活は一緒に協議する。", lead: "五つの寮を比較し、月相・翼幅・水域・使い魔・生活時間を申告。寮務委員会が三案を示し、合う点と揉めそうな点を両方明記します。",
    term: "2026年秋入寮", residences: "学生寮", openBeds: "現在の空床", monthlyFrom: "最低月額", tabs: ["寮一覧", "申請・配室", "自分の寮"], overview: "五つの寮、五通りの帰室方法。", overviewLead: "寮を選び、室種・空床・設備・寮監掲示を確認。選択中の表札は直接共有できます。",
    details: "寮ファイル", roomTypes: "今期申請可能室", features: "共用設備", warden: "寮監・管理", notice: "扉の掲示", distance: "通学経路", beds: "床", open: "空", month: "円／月", applyHere: "この寮を第一志望にする",
    applicationTitle: "入寮希望申請", applicationLead: "性格診断ではありません。眠れて、帰室でき、満月の深夜に椅子一脚で会議になりにくい組合せを探すための票です。",
    identityNeeded: "先にMy TU身分を作成すると、委員会が誰の室番号か確認できます。寮ファイルは自由に閲覧できます。", createIdentity: "My TU身分を作成", applicant: "申請者",
    firstResidence: "第一志望寮", secondResidence: "第二志望寮", roomType: "希望室種", anyRoom: "どの室種でも", budget: "月額上限", habits: "共同生活・身体上の要件",
    sleep: "主な睡眠時間", noise: "室内の音量", cleanliness: "整理方法", cooking: "厨房利用", moon: "月相反応", water: "水域要件", flight: "飛行／翼幅", wall: "壁の利用", familiar: "使い魔空間", danmaku: "室内弾幕",
    note: "事前に伝えるべきこと", notePlaceholder: "例：水曜に鞄が大きくなる。朝食を盗む同室者は不可。", draft: "入力はこの端末へ自動保存されます。", submit: "寮務委員会へ提出", clear: "下書きを消去",
    draftSaved: "入寮希望の下書きをこの端末へ保存しました。", submitted: "申請を提出し、三つの配室案を用意しました。", applicationRef: "入寮申請", applicationHistory: "端末内入寮申請履歴", chooseApplication: "入寮申請を選択",
    matchingTitle: "寮務委員会の三案", matchingLead: "点数は友情の保証ではありません。設備・生活習慣・要件の重なりを示し、摩擦点も判断材料として残します。", score: "適合", matchedWith: "同室者", noRoommate: "今期一人室", fit: "適合理由", friction: "先に話すこと", accept: "この部屋を受諾", decline: "この案を見送る",
    accepted: "部屋を受諾し、「自分の寮」へ記録しました。", allocationClosed: "この申請は配室済みです", declined: "この案を見送りました。委員会はこっそり一番上へ戻しません。", allDeclined: "三案をすべて見送りました。要件を書き直して再配室できます。", newApplication: "希望を再入力",
    accountTitle: "自分の寮", accountLead: "室番号、同室者協定、入寮メモ、転室依頼をこの端末へ保存します。", noAssignment: "受諾済みの部屋はありません。申請後、委員会案から一つ選んでください。", goApplication: "申請・配室へ",
    activeRoom: "現在の部屋", roommateFile: "同室者ファイル", fee: "月額", acceptedOn: "受諾日", moveIn: "入寮日", moveInDate: "2026年9月6日・日没前",
    agreement: "共同生活協定", agreementLead: "両者の要件から、先に話す四規則を生成しました。チェックは端末内で読んだ印です。同室者が朝食を盗まない保証ではありません。", agreementCheck: "共同生活メモを確認しました", agreementSaved: "共同生活メモの状態を更新しました。",
    roomChange: "転室申請", roomChangeLead: "現に起きている問題を記入。委員会は元の部屋を保持したまま代替案を付け、寝床を突然消しません。", reason: "主な理由", urgency: "対応期限", changeNote: "具体的状況", sendChange: "転室依頼を提出", changeSent: "転室依頼を保存しました。現在の部屋は有効です。",
    changeHistory: "転室依頼履歴", cancelChange: "依頼を撤回", changeCancelled: "転室依頼を撤回しました。", suggestion: "委員会暫定代替", status: { "under-review": "審査中", cancelled: "撤回済" },
    reasons: {
      firstResidence: "第一志望寮", secondResidence: "第二志望寮", roomType: "希望室種", withinBudget: "月額上限内", sleepMatch: "睡眠時間が近い", noiseMatch: "室内音量の習慣が一致", cleanlinessMatch: "整理の周期が近い", cookingMatch: "厨房時間が両立", moonProtected: "遮月・低刺激設備", waterAccess: "水域へ直接接続", waterNearby: "水域が近い", wingSpace: "翼幅の旋回余裕", flightStorage: "飛行具収納", phaseSafe: "壁抜け標線あり", familiarWelcome: "大型使い魔区画", familiarBay: "小型使い魔休憩区", blastDesk: "耐爆作業机", quietWard: "夜間静音結界", singleRoom: "固定同室者との調整不要",
    },
    frictions: {
      sleepConflict: "睡眠時間が異なり静音時間の合意が必要", noiseConflict: "室内音量の許容差", cleanlinessConflict: "整理基準が衝突しうる", moonConflict: "満月時の生活が異なる", waterConflict: "水域利用の習慣差", flightConflict: "窓辺と離陸動線の配分", wallConflict: "扉と壁の定義が異なる", familiarConflict: "使い魔用家具に記名が必要", danmakuConflict: "室内弾幕の境界が異なる", moonUnshielded: "完全な遮月設備なし", waterMissing: "水域へ直結しない", wingTight: "大翼幅の転回が狭い", phaseUnmarked: "安全な壁抜け標線なし", familiarCrowded: "大型使い魔区画が狭い", danmakuOutside: "弾幕練習は屋外", roomTypeDifferent: "希望室種と異なる", overBudget: "申告月額を超える",
    },
    incidents: {
      doorName: "表札には室番号と両名を併記。室番号が変化した場合は氏名を優先。", singleVisitor: "一人室の来客は「臨時同室者」として三泊を超えられない。四泊目に寝床申請票を渡す。", quietHours: "睡眠時間が異なるため、毎日の静音時間を扉へ記載。変更は夕食前まで。", nightKitchen: "深夜厨房は赤灯を一本残し、鍋を目覚ましにしない。", fullMoon: "満月前後三夜は低刺激を要する側を優先。活動量は談話室で受け止める。", familiarChair: "使い魔と家具は早い者勝ちでない。窓辺椅子の表を毎週更新。", wallKnock: "壁抜け前に三回ノック。壁か扉かに関係なく三回。", waterSchedule: "室内水路は毎日06:00清障。私物を「仮設水利」と呼ばない。", windowRunway: "窓辺の離陸線を空け、物干し高は翼幅の大きい側が試す。", danmakuTape: "赤テープ内のみ耐爆区画。テープを動かしても部屋は広がらない。",
    },
    options: {
      sleep: { early: "早寝早起き", late: "夜行", shifting: "交替／不定" }, noise: { quiet: "静かめ", social: "会話・音楽可" }, cleanliness: { neat: "定位置へ戻す", relaxed: "床が見えれば可" }, cooking: { no: "ほぼ不使用", shared: "通常利用", night: "深夜利用あり" }, moon: { ordinary: "特になし", sensitive: "遮月／低刺激が必要", active: "満月に活発" }, water: { dry: "通常の乾燥室", near: "水辺希望", must: "水域直結必須" }, flight: { ground: "飛行空間不要", small: "箒／小翼幅", large: "大翼幅" }, wall: { solid: "扉のみ使用", phase: "壁抜け標線が必要" }, familiar: { none: "固定使い魔なし", small: "小型使い魔", large: "大型／複数使い魔" }, danmaku: { none: "室内練習なし", outdoors: "屋外のみ", indoor: "耐爆室内区が必要" },
      reasons: { schedule: "生活時間・音", moon: "月相／感覚要件", water: "水域・身体要件", familiar: "使い魔・空間不足", conflict: "共同生活の衝突", route: "通学経路", other: "その他" }, urgency: { ordinary: "通常審査", soon: "七日以内", immediate: "当日連絡希望" },
    },
  },
  en: {
    eyebrow: "RESIDENTIAL LIFE", title: "Rooms are allocated. Living together is negotiated.", lead: "Compare five residences and record needs around moon phase, wingspan, water, familiars, and sleep. The housing committee returns three room offers with both the fit and the likely arguments in writing.",
    term: "Autumn 2026 move-in", residences: "residences", openBeds: "Open beds now", monthlyFrom: "Lowest monthly fee", tabs: ["Residences", "Apply & match", "My housing"], overview: "Five halls. Five ways to get home.", overviewLead: "Choose a hall to see rooms, open beds, facilities, and the notice pinned by its warden. The selected sign has a shareable address.",
    details: "Residence file", roomTypes: "Rooms open this term", features: "Shared facilities", warden: "Warden & management", notice: "Pinned to the door", distance: "Route to campus", beds: "beds", open: "open", month: "yen / month", applyHere: "Make this my first choice",
    applicationTitle: "Housing needs application", applicationLead: "This is not a personality test. It finds combinations that can sleep, get home, and are less likely to hold a full-moon meeting over one chair.",
    identityNeeded: "Create a My TU identity first so the housing committee knows whose name belongs beside the room number. Residence files remain open to everyone.", createIdentity: "Create My TU identity", applicant: "Applicant",
    firstResidence: "First-choice residence", secondResidence: "Second-choice residence", roomType: "Preferred room type", anyRoom: "Any room type", budget: "Monthly fee ceiling", habits: "Shared-life and physical needs",
    sleep: "Main sleeping hours", noise: "Room noise", cleanliness: "Tidying style", cooking: "Kitchen use", moon: "Moon response", water: "Water access", flight: "Flight / wingspan", wall: "Wall use", familiar: "Familiar space", danmaku: "Indoor danmaku",
    note: "Anything that must be said first", notePlaceholder: "For example: my suitcase becomes larger on Wednesdays; no roommate who steals breakfast.", draft: "This form autosaves on this device.", submit: "Send to housing committee", clear: "Clear draft",
    draftSaved: "Housing needs draft saved on this device.", submitted: "Application submitted. Three room proposals are on the table.", applicationRef: "Housing application", applicationHistory: "On-device housing application history", chooseApplication: "Choose a housing application",
    matchingTitle: "Three committee proposals", matchingLead: "A score is not a promise of friendship. It measures overlap between facilities, habits, and your needs; friction remains visible for your judgment.", score: "match", matchedWith: "Roommate", noRoommate: "Single room this term", fit: "Why it fits", friction: "Discuss first", accept: "Accept this room", decline: "Pass on this offer",
    accepted: "Room accepted and written into My Housing.", allocationClosed: "Allocation completed for this application", declined: "Offer passed. The committee did not quietly put it back on top.", allDeclined: "All three proposals were passed. Rewrite your needs for a new match.", newApplication: "Rewrite my needs",
    accountTitle: "My housing", accountLead: "Room, roommate agreement, move-in notes, and transfer requests stay on this device.", noAssignment: "No room has been accepted. Complete the needs form and choose a committee offer.", goApplication: "Go to application & matching",
    activeRoom: "Current room", roommateFile: "Roommate profile", fee: "Monthly fee", acceptedOn: "Accepted", moveIn: "Move-in", moveInDate: "6 September 2026 · before sunset",
    agreement: "Roommate agreement", agreementLead: "The committee generated four rules from both sets of needs. Checking means you read them on this device; it does not mean your roommate promised not to steal breakfast.", agreementCheck: "I have read this shared-living note", agreementSaved: "Agreement status updated.",
    roomChange: "Room-transfer request", roomChangeLead: "Describe what is actually happening. The committee keeps your current room and attaches a viable alternative; your bed does not suddenly disappear.", reason: "Main reason", urgency: "Response time", changeNote: "What is happening", sendChange: "Send transfer request", changeSent: "Transfer request saved; your current room remains active.",
    changeHistory: "Transfer-request history", cancelChange: "Withdraw request", changeCancelled: "Transfer request withdrawn.", suggestion: "Provisional alternative", status: { "under-review": "Under review", cancelled: "Withdrawn" },
    reasons: {
      firstResidence: "First-choice residence", secondResidence: "Second-choice residence", roomType: "Preferred room type", withinBudget: "Within fee ceiling", sleepMatch: "Similar sleep hours", noiseMatch: "Matching room-noise habits", cleanlinessMatch: "Similar tidying rhythm", cookingMatch: "Compatible kitchen hours", moonProtected: "Moon screen and low-stimulus fittings", waterAccess: "Direct water access", waterNearby: "Water is nearby", wingSpace: "Enough turning space for wings", flightStorage: "Flight-gear storage", phaseSafe: "Marked wall-passage lines", familiarWelcome: "Dedicated large-familiar space", familiarBay: "Small familiar bay", blastDesk: "Blast-resistant workbench", quietWard: "Night quiet ward", singleRoom: "No fixed roommate to coordinate",
    },
    frictions: {
      sleepConflict: "Sleep schedules need agreed quiet hours", noiseConflict: "Different tolerance for room noise", cleanlinessConflict: "Tidying standards may collide", moonConflict: "Different full-moon patterns", waterConflict: "Different water-use habits", flightConflict: "Window and take-off path need allocation", wallConflict: "Different definitions of doors and walls", familiarConflict: "Furniture for familiars needs labels", danmakuConflict: "Different indoor danmaku boundaries", moonUnshielded: "No complete moon screening", waterMissing: "No direct water connection", wingTight: "Limited turning space for large wings", phaseUnmarked: "No marked safe wall passage", familiarCrowded: "Tight space for a large familiar", danmakuOutside: "Danmaku practice must move outdoors", roomTypeDifferent: "Not the requested room type", overBudget: "Above the stated fee ceiling",
    },
    incidents: {
      doorName: "The sign must show both names and the room number. If the number changes itself, use the names.", singleVisitor: "A single-room guest may not stay beyond three nights as a “temporary roommate”; on night four they receive a bed application.", quietHours: "Sleep hours differ. Post daily quiet hours on the door; change them before dinner.", nightKitchen: "Keep one red lamp on during late kitchen use. Do not use a saucepan as an alarm.", fullMoon: "For three nights around the full moon, low-stimulus needs take priority; the lounge absorbs the other resident’s activity.", familiarChair: "Familiars and furniture are not first come, first served. Redraw the window-chair rota weekly.", wallKnock: "Knock three times before phasing. Whether it is a wall or door does not alter the number three.", waterSchedule: "Clear the room channel at 06:00 daily. Personal objects may not be renamed “temporary waterworks.”", windowRunway: "Keep the window take-off line clear. The wider wingspan tests the clothesline height first.", danmakuTape: "Only the area inside red tape is blast-resistant. Moving the tape does not enlarge the room.",
    },
    options: {
      sleep: { early: "Early sleeper", late: "Nocturnal", shifting: "Shift / irregular" }, noise: { quiet: "Prefer quiet", social: "Conversation and music are fine" }, cleanliness: { neat: "Everything returned to place", relaxed: "Floor visible is enough" }, cooking: { no: "Rarely use it", shared: "Normal shared use", night: "Often cook late" }, moon: { ordinary: "No special response", sensitive: "Need moon screen / low stimulus", active: "More active at full moon" }, water: { dry: "Ordinary dry room", near: "Prefer nearby water", must: "Direct water access required" }, flight: { ground: "No flight space needed", small: "Broom / small wingspan", large: "Large wingspan" }, wall: { solid: "Use doors only", phase: "Need wall-passage markings" }, familiar: { none: "No resident familiar", small: "Small familiar", large: "Large / several familiars" }, danmaku: { none: "No indoor practice", outdoors: "Outdoors only", indoor: "Need blast-resistant indoor zone" },
      reasons: { schedule: "Schedule / noise", moon: "Moon / sensory needs", water: "Water / physical needs", familiar: "Familiar / insufficient space", conflict: "Shared-living conflict", route: "Commute", other: "Other" }, urgency: { ordinary: "Ordinary review", soon: "Within seven days", immediate: "Contact me today" },
    },
  },
};

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  }[character]));
}

function formatDate(value, locale) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function optionMarkup(options, selected) {
  return Object.entries(options).map(([value, label]) =>
    `<option value="${value}" ${value === selected ? "selected" : ""}>${label}</option>`).join("");
}

function currentTab() {
  const hash = safeDecodeFragment();
  if (hash === "housing-application") return "application";
  if (hash === "housing-account") return "account";
  return "overview";
}

function selectedResidenceId() {
  const hash = safeDecodeFragment();
  const match = hash.match(/^housing-residence-(.+)$/);
  return residenceById(match?.[1])?.id || residences[0].id;
}

function setRoute(route) {
  const previous = window.location.href;
  const next = new URL(previous);
  next.hash = route;
  window.history.replaceState({ ...(window.history.state || {}), route }, "", next);
  window.dispatchEvent(new HashChangeEvent("hashchange", { oldURL: previous, newURL: next.href }));
}

function hero(locale, c) {
  const lowest = Math.min(...housingRooms.map((room) => room.fee));
  const open = housingRooms.reduce((sum, room) => sum + room.openBeds, 0);
  return `
    <section class="housing-hero">
      <div class="housing-hero-art" aria-hidden="true">
        <span class="housing-moon"></span><i></i><i></i><i></i><i></i><i></i>
        <b>入<br>寮<br>案<br>内</b>
      </div>
      <div class="housing-hero-copy">
        <p>${c.eyebrow}</p><h2>${c.title}</h2><span>${c.lead}</span>
        <dl>
          <div><dt>${c.term}</dt><dd>09.06</dd></div>
          <div><dt>${c.residences}</dt><dd>${residences.length}</dd></div>
          <div><dt>${c.openBeds}</dt><dd>${open}</dd></div>
          <div><dt>${c.monthlyFrom}</dt><dd>¥${lowest.toLocaleString(locale)}</dd></div>
        </dl>
      </div>
    </section>`;
}

function tabs(active, c) {
  const records = housingApplications().length;
  const assignment = activeHousingAssignment();
  return `
    <nav class="housing-tabs" aria-label="${c.eyebrow}">
      ${["overview", "application", "account"].map((tab, index) => `
        <button type="button" data-housing-tab="${tab}" aria-selected="${active === tab}">
          <span>0${index + 1}</span>${c.tabs[index]}
          ${tab === "application" && records ? `<b>${records}</b>` : tab === "account" && assignment ? "<b>1</b>" : ""}
        </button>`).join("")}
    </nav>`;
}

function roomLine(room, locale, c) {
  return `<li><strong>${escapeHtml(room.id)} · ${housingFacets.roomTypes[room.type][locale]}</strong><span>${room.beds} ${c.beds} · ${room.openBeds} ${c.open} · ¥${room.fee.toLocaleString(locale)} ${c.month}</span></li>`;
}

function overviewView(locale, c) {
  const selected = selectedResidenceId();
  const residence = residenceById(selected);
  const rooms = housingRooms.filter((room) => room.residence === selected);
  return `
    <header class="housing-view-heading"><div><p>RESIDENCE FILES</p><h3>${c.overview}</h3></div><span>${c.overviewLead}</span></header>
    <div class="housing-overview">
      <div class="residence-list" data-preserve-scroll="residence-list">
        ${residences.map((item) => {
          const hallRooms = housingRooms.filter((room) => room.residence === item.id);
          return `<button type="button" data-residence-select="${item.id}" aria-pressed="${item.id === selected}">
            <i>${item.mark}</i><span><strong>${item.name[locale]}</strong><small>${item.area[locale]}</small></span>
            <b>${hallRooms.reduce((sum, room) => sum + room.openBeds, 0)} ${c.open}</b>
          </button>`;
        }).join("")}
      </div>
      <article class="residence-file" data-residence-file="${residence.id}">
        <header><span>${residence.mark}</span><div><p>${c.details} · ${residence.id.toUpperCase()}</p><h3>${residence.name[locale]}</h3><small>${residence.area[locale]}</small></div></header>
        <p class="residence-description">${residence.description[locale]}</p>
        <dl class="residence-facts">
          <div><dt>${c.distance}</dt><dd>${residence.distance[locale]}</dd></div>
          <div><dt>${c.warden}</dt><dd>${residence.warden[locale]}</dd></div>
        </dl>
        <div class="residence-room-features">
          <section><h4>${c.roomTypes}</h4><ul>${rooms.map((room) => roomLine(room, locale, c)).join("")}</ul></section>
          <section><h4>${c.features}</h4><ul class="housing-feature-list">${residence.features.map((id) => `<li>${housingFacets.features[id][locale]}</li>`).join("")}</ul></section>
        </div>
        <aside><span>${c.notice}</span><p>「${residence.notice[locale]}」</p></aside>
        <button class="button button-primary" type="button" data-housing-apply-residence="${residence.id}">${c.applyHere} <span aria-hidden="true">→</span></button>
      </article>
    </div>`;
}

function selectField(name, label, options, value) {
  return `<label><span>${label}</span><select name="${name}">${optionMarkup(options, value)}</select></label>`;
}

function defaultPreferences() {
  const draft = housingDraft()?.preferences;
  return draft || {
    firstResidence: residences[0].id, secondResidence: residences[1].id, roomType: "any", budget: "19000",
    sleep: "early", noise: "quiet", cleanliness: "neat", cooking: "shared", moon: "ordinary",
    water: "dry", flight: "ground", wall: "solid", familiar: "none", danmaku: "outdoors", note: "",
  };
}

function applicationForm(locale, c, firstChoice = null) {
  const identity = housingIdentity();
  const p = defaultPreferences();
  if (firstChoice) p.firstResidence = firstChoice;
  if (!identity) return `
    <section class="housing-empty housing-identity-needed">
      <span aria-hidden="true">學</span><div><h3>${c.applicationTitle}</h3><p>${c.identityNeeded}</p></div>
      <a class="button button-primary" href="mytu.html#my-tu">${c.createIdentity} <span aria-hidden="true">→</span></a>
    </section>`;
  const residenceOptions = Object.fromEntries(residences.map((residence) => [residence.id, residence.name[locale]]));
  const roomOptions = { any: c.anyRoom, ...Object.fromEntries(Object.entries(housingFacets.roomTypes).map(([id, label]) => [id, label[locale]])) };
  const budgets = { 15000: "¥15,000", 18000: "¥18,000", 21000: "¥21,000", 25000: "¥25,000" };
  return `
    <header class="housing-view-heading"><div><p>HOUSING NEEDS FORM</p><h3>${c.applicationTitle}</h3></div><span>${c.applicationLead}</span></header>
    <form class="housing-form" data-housing-form>
      <div class="housing-form-stamp"><span>${c.applicant}</span><strong>${escapeHtml(identity.name || identity.id)}</strong><code>${escapeHtml(identity.id)}</code></div>
      <fieldset><legend>01 / ${c.applicationTitle}</legend>
        <div class="housing-form-grid">
          ${selectField("firstResidence", c.firstResidence, residenceOptions, p.firstResidence)}
          ${selectField("secondResidence", c.secondResidence, residenceOptions, p.secondResidence)}
          ${selectField("roomType", c.roomType, roomOptions, p.roomType)}
          ${selectField("budget", c.budget, budgets, String(p.budget))}
        </div>
      </fieldset>
      <fieldset><legend>02 / ${c.habits}</legend>
        <div class="housing-form-grid housing-needs-grid">
          ${["sleep", "noise", "cleanliness", "cooking", "moon", "water", "flight", "wall", "familiar", "danmaku"].map((field) =>
            selectField(field, c[field], c.options[field], p[field])).join("")}
        </div>
      </fieldset>
      <label class="housing-note"><span>${c.note}</span><textarea name="note" rows="4" maxlength="700" placeholder="${c.notePlaceholder}">${escapeHtml(p.note)}</textarea></label>
      <footer><span>${c.draft}</span><button class="button button-secondary" type="button" data-housing-clear>${c.clear}</button><button class="button button-primary" type="submit">${c.submit} <span aria-hidden="true">→</span></button></footer>
    </form>`;
}

function reasonList(codes, source) {
  return codes.length ? `<ul>${codes.map((code) => `<li>${source[code] || code}</li>`).join("")}</ul>` : "—";
}

function offerCard(application, offer, locale, c, index) {
  const room = housingRooms.find((record) => record.id === offer.roomId);
  const residence = residenceById(offer.residenceId);
  const roommate = roommateById(offer.roommateId);
  const declined = application.declinedOfferIds?.includes(offer.id);
  const accepted = application.acceptedOfferId === offer.id;
  return `
    <article class="housing-offer ${declined ? "is-declined" : ""}" data-housing-offer="${offer.id}">
      <header><span>0${index + 1}</span><div><p>${residence.name[locale]}</p><h4>${room.id} · ${housingFacets.roomTypes[room.type][locale]}</h4></div><b>${offer.score}<small>% ${c.score}</small></b></header>
      <div class="housing-offer-person">
        <i>${roommate?.seal || "一"}</i><div><span>${c.matchedWith}</span><strong>${roommate ? roommate.name[locale] : c.noRoommate}</strong><small>${roommate ? `${roommate.kind[locale]} · ${roommate.school[locale]}` : residence.area[locale]}</small></div>
      </div>
      ${roommate ? `<p>${roommate.bio[locale]}</p>` : ""}
      <dl><div><dt>${c.fit}</dt><dd>${reasonList(offer.positive, c.reasons)}</dd></div><div><dt>${c.friction}</dt><dd>${reasonList(offer.friction, c.frictions)}</dd></div></dl>
      <footer><span>¥${offer.fee.toLocaleString(locale)} ${c.month}</span>
        ${declined ? `<b>${c.declined}</b>` : application.status === "assigned" ? `<b>${accepted ? c.accepted : c.allocationClosed}</b>` : `<button class="button button-secondary" type="button" data-housing-decline="${offer.id}" data-application-id="${application.id}">${c.decline}</button><button class="button button-primary" type="button" data-housing-accept="${offer.id}" data-application-id="${application.id}">${c.accept}</button>`}
      </footer>
    </article>`;
}

function matchingView(application, locale, c) {
  const records = housingApplications();
  const available = application.offers.filter((offer) => !application.declinedOfferIds?.includes(offer.id));
  return `
    <header class="housing-view-heading"><div><p>${c.applicationRef} · ${escapeHtml(application.id)}</p><h3>${c.matchingTitle}</h3></div><span>${c.matchingLead}</span></header>
    <div class="housing-application-meta"><span>${formatDate(application.submittedAt, locale)}</span><code>${escapeHtml(application.id)}</code>
      ${records.length > 1 ? `<label>${c.chooseApplication}<select data-housing-application-select>${records.slice().reverse().map((record) => `<option value="${escapeHtml(record.id)}" ${record.id === application.id ? "selected" : ""}>${escapeHtml(record.id)} · ${formatDate(record.submittedAt, locale)}</option>`).join("")}</select></label>` : ""}
    </div>
    <div class="housing-offers">${application.offers.map((offer, index) => offerCard(application, offer, locale, c, index)).join("")}</div>
    ${available.length ? "" : `<section class="housing-empty"><span>再</span><div><h3>${c.allDeclined}</h3></div><button class="button button-primary" type="button" data-housing-new>${c.newApplication}</button></section>`}
    ${available.length ? `<button class="housing-new-link" type="button" data-housing-new>${c.newApplication}</button>` : ""}`;
}

function applicationView(locale, c, forceForm, firstChoice, selectedApplicationId) {
  const records = housingApplications();
  const selected = records.find((record) => record.id === selectedApplicationId) || latestHousingApplication();
  if (forceForm || !selected) return applicationForm(locale, c, firstChoice);
  return matchingView(selected, locale, c);
}

function accountView(locale, c) {
  const assignment = activeHousingAssignment();
  if (!assignment) return `
    <header class="housing-view-heading"><div><p>MY HOUSING</p><h3>${c.accountTitle}</h3></div><span>${c.accountLead}</span></header>
    <section class="housing-empty"><span aria-hidden="true">寮</span><div><p>${c.noAssignment}</p></div><button class="button button-primary" type="button" data-housing-tab="application">${c.goApplication} <span aria-hidden="true">→</span></button></section>`;
  const room = roomForAssignment(assignment);
  const residence = residenceById(assignment.residenceId);
  const roommate = roommateById(assignment.roommateId);
  const requests = housingRoomChanges().filter((record) => record.assignmentId === assignment.id).reverse();
  return `
    <header class="housing-view-heading"><div><p>MY HOUSING · ${escapeHtml(assignment.id)}</p><h3>${c.accountTitle}</h3></div><span>${c.accountLead}</span></header>
    <div class="housing-account">
      <section class="housing-room-card">
        <header><span>${residence.mark}</span><div><p>${c.activeRoom}</p><h3>${room.id}</h3><strong>${residence.name[locale]} · ${housingFacets.roomTypes[room.type][locale]}</strong></div></header>
        <dl>
          <div><dt>${c.fee}</dt><dd>¥${assignment.fee.toLocaleString(locale)}</dd></div>
          <div><dt>${c.acceptedOn}</dt><dd>${formatDate(assignment.acceptedAt, locale)}</dd></div>
          <div><dt>${c.moveIn}</dt><dd>${c.moveInDate}</dd></div>
        </dl>
        <ul class="housing-feature-list">${room.features.map((id) => `<li>${housingFacets.features[id][locale]}</li>`).join("")}</ul>
      </section>
      <section class="housing-roommate-card">
        <p>${c.roommateFile}</p>
        <div><i>${roommate?.seal || "一"}</i><h3>${roommate ? roommate.name[locale] : c.noRoommate}</h3></div>
        <span>${roommate ? `${roommate.kind[locale]} · ${roommate.school[locale]}` : residence.area[locale]}</span>
        <p>${roommate ? roommate.bio[locale] : residence.notice[locale]}</p>
      </section>
    </div>
    <section class="housing-agreement">
      <header><div><p>ROOMMATE MEMORANDUM</p><h3>${c.agreement}</h3></div><span>${c.agreementLead}</span></header>
      <ol>${assignment.incidentCodes.map((code) => `<li><span>${String(assignment.incidentCodes.indexOf(code) + 1).padStart(2, "0")}</span><p>${c.incidents[code]}</p></li>`).join("")}</ol>
      <label><input type="checkbox" data-housing-agreement="${assignment.id}" ${assignment.agreementChecked ? "checked" : ""}><span>${c.agreementCheck}</span></label>
    </section>
    <section class="housing-change">
      <header><div><p>ROOM TRANSFER DESK</p><h3>${c.roomChange}</h3></div><span>${c.roomChangeLead}</span></header>
      <form data-housing-change-form>
        ${selectField("reason", c.reason, c.options.reasons, "schedule")}
        ${selectField("urgency", c.urgency, c.options.urgency, "ordinary")}
        <label><span>${c.changeNote}</span><textarea name="note" rows="3" maxlength="600" required></textarea></label>
        <button class="button button-primary" type="submit">${c.sendChange} <span aria-hidden="true">→</span></button>
      </form>
      ${requests.length ? `<div class="housing-change-history"><h4>${c.changeHistory}</h4>${requests.map((request) => {
        const suggestedRoom = request.suggestion ? housingRooms.find((record) => record.id === request.suggestion.roomId) : null;
        const suggestedResidence = request.suggestion ? residenceById(request.suggestion.residenceId) : null;
        return `<article><header><code>${escapeHtml(request.id)}</code><b>${c.status[request.status] || request.status}</b></header><p>${c.options.reasons[request.reason]} · ${c.options.urgency[request.urgency]}</p><span>${escapeHtml(request.note)}</span>
          ${suggestedRoom ? `<small>${c.suggestion}: ${suggestedResidence.name[locale]} · ${suggestedRoom.id} · ${request.suggestion.score}%</small>` : ""}
          ${request.status === "under-review" ? `<button type="button" data-housing-cancel-change="${request.id}">${c.cancelChange}</button>` : ""}</article>`;
      }).join("")}</div>` : ""}
    </section>`;
}

function formPreferences(form) {
  return Object.fromEntries(new FormData(form).entries());
}

export function initHousing() {
  const root = document.querySelector("[data-housing-app]");
  if (!root) return;
  let forceForm = false;
  let firstChoice = null;
  let selectedApplicationId = latestHousingApplication()?.id || null;

  function render({ preserveWindow = false } = {}) {
    const locale = getLocale();
    const c = copy[locale];
    const active = currentTab();
    renderPreservingState(root, () => {
      const routeId = active === "overview" ? `housing-residence-${selectedResidenceId()}` : `housing-${active}`;
      root.innerHTML = `${hero(locale, c)}${tabs(active, c)}<div class="housing-view" id="${routeId}">${
        active === "overview" ? overviewView(locale, c)
          : active === "application" ? applicationView(locale, c, forceForm, firstChoice, selectedApplicationId)
            : accountView(locale, c)
      }</div>`;
    }, { preserveWindow });
  }

  root.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-housing-tab]");
    if (tab) {
      const route = tab.dataset.housingTab === "application" ? "housing-application" : tab.dataset.housingTab === "account" ? "housing-account" : "housing";
      forceForm = false;
      firstChoice = null;
      setRoute(route);
      return;
    }
    const residence = event.target.closest("[data-residence-select]");
    if (residence) {
      setRoute(`housing-residence-${residence.dataset.residenceSelect}`);
      return;
    }
    const apply = event.target.closest("[data-housing-apply-residence]");
    if (apply) {
      firstChoice = apply.dataset.housingApplyResidence;
      forceForm = true;
      setRoute("housing-application");
      return;
    }
    if (event.target.closest("[data-housing-new]")) {
      forceForm = true;
      firstChoice = null;
      render({ preserveWindow: true });
      return;
    }
    if (event.target.closest("[data-housing-clear]")) {
      clearHousingDraft();
      forceForm = true;
      firstChoice = null;
      render({ preserveWindow: true });
      return;
    }
    const accept = event.target.closest("[data-housing-accept]");
    if (accept) {
      const assignment = acceptHousingOffer(accept.dataset.applicationId, accept.dataset.housingAccept);
      if (!assignment) return;
      recordCampusEvent("housing.assignment.accepted", {
        assignmentId: assignment.id,
        applicationId: assignment.applicationId,
        offerId: assignment.offerId,
        roomId: assignment.roomId,
        residenceId: assignment.residenceId,
      }, { id: `housing.assignment.accepted:${assignment.id}`, timestamp: assignment.acceptedAt });
      showToast(copy[getLocale()].accepted);
      setRoute("housing-account");
      return;
    }
    const decline = event.target.closest("[data-housing-decline]");
    if (decline) {
      const application = declineHousingOffer(decline.dataset.applicationId, decline.dataset.housingDecline);
      if (!application) return;
      recordCampusEvent("housing.offer.declined", {
        applicationId: application.id, offerId: decline.dataset.housingDecline,
      }, { id: `housing.offer.declined:${application.id}:${decline.dataset.housingDecline}` });
      showToast(copy[getLocale()].declined);
      render({ preserveWindow: true });
      return;
    }
    const cancel = event.target.closest("[data-housing-cancel-change]");
    if (cancel) {
      const request = cancelHousingRoomChange(cancel.dataset.housingCancelChange);
      if (!request) return;
      recordCampusEvent("housing.change.cancelled", {
        requestId: request.id, assignmentId: request.assignmentId,
      }, { id: `housing.change.cancelled:${request.id}`, timestamp: request.cancelledAt });
      showToast(copy[getLocale()].changeCancelled);
      render({ preserveWindow: true });
    }
  });

  root.addEventListener("input", (event) => {
    const form = event.target.closest("[data-housing-form]");
    if (!form) return;
    saveHousingDraft(formPreferences(form));
  });
  root.addEventListener("change", (event) => {
    const applicationSelect = event.target.closest("[data-housing-application-select]");
    if (applicationSelect) {
      selectedApplicationId = applicationSelect.value;
      render({ preserveWindow: true });
      return;
    }
    const form = event.target.closest("[data-housing-form]");
    if (form) {
      saveHousingDraft(formPreferences(form));
      showToast(copy[getLocale()].draftSaved);
      return;
    }
    const agreement = event.target.closest("[data-housing-agreement]");
    if (agreement) {
      confirmHousingAgreement(agreement.dataset.housingAgreement, agreement.checked);
      showToast(copy[getLocale()].agreementSaved);
    }
  });
  root.addEventListener("submit", (event) => {
    const applicationFormElement = event.target.closest("[data-housing-form]");
    if (applicationFormElement) {
      event.preventDefault();
      const preferences = formPreferences(applicationFormElement);
      if (preferences.firstResidence === preferences.secondResidence) {
        const alternative = residences.find((residence) => residence.id !== preferences.firstResidence);
        preferences.secondResidence = alternative.id;
      }
      const application = submitHousingApplication(preferences);
      selectedApplicationId = application.id;
      recordCampusEvent("housing.application.submitted", {
        applicationId: application.id, firstResidence: preferences.firstResidence, term: application.term,
      }, { id: `housing.application.submitted:${application.id}`, timestamp: application.submittedAt });
      forceForm = false;
      firstChoice = null;
      showToast(copy[getLocale()].submitted);
      render({ preserveWindow: true });
      return;
    }
    const changeForm = event.target.closest("[data-housing-change-form]");
    if (changeForm) {
      event.preventDefault();
      const payload = Object.fromEntries(new FormData(changeForm).entries());
      const request = submitHousingRoomChange(payload);
      if (!request) return;
      recordCampusEvent("housing.change.requested", {
        requestId: request.id, assignmentId: request.assignmentId, reason: request.reason,
      }, { id: `housing.change.requested:${request.id}`, timestamp: request.submittedAt });
      showToast(copy[getLocale()].changeSent);
      render({ preserveWindow: true });
    }
  });

  window.addEventListener("hashchange", () => render());
  window.addEventListener("tu:languagechange", () => render({ preserveWindow: true }));
  render();
}
