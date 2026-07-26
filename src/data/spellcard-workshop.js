const l = (zh, ja, en) => ({ "zh-Hant": zh, ja, en });

export const spellPatterns = [
  {
    id: "star-orbit",
    glyph: "星",
    kind: "orbit",
    name: l("星屑軌道", "星屑軌道", "Stardust Orbit"),
    premise: l(
      "由中心向外展開的星環；承諾很清楚，第二圈通常不肯照第一圈的意思走。",
      "中心から広がる星環。予告は明快だが、第二環は第一環の意図に従いたがらない。",
      "Star rings expand from the centre. The promise is clear; the second ring rarely obeys the first.",
    ),
  },
  {
    id: "amulet-fan",
    glyph: "札",
    kind: "fan",
    name: l("御札扇門", "御札扇門", "Ofuda Fan Gate"),
    premise: l(
      "扇形彈幕在宣言後留下數道門；門夠不夠算退路，靈夢與設計者往往意見不同。",
      "宣言後、扇状弾幕に複数の門が残る。その門が退路かどうか、霊夢と設計者はよく意見が違う。",
      "A fan of shots leaves several gates after declaration. Reimu and the designer often disagree on whether they count as exits.",
    ),
  },
  {
    id: "frozen-lattice",
    glyph: "凍",
    kind: "lattice",
    name: l("凍結格子", "凍結格子", "Frozen Lattice"),
    premise: l(
      "整齊的冰晶列先停住、再換位；看懂格子不難，記得它剛才在哪裡比較難。",
      "整然とした氷晶列が停止してから転位する。格子を読むのは易しいが、直前の位置を覚えるのは難しい。",
      "Orderly ice rows stop, then shift. Reading the lattice is easy; remembering where it just was is harder.",
    ),
  },
  {
    id: "wind-corridor",
    glyph: "風",
    kind: "wave",
    name: l("風切回廊", "風切回廊", "Wind-Cut Gallery"),
    premise: l(
      "兩側風彈交錯，把安全走廊推著移動；觀眾看得最清楚的角度通常不在參與者那邊。",
      "両側の風弾が交差し、安全回廊を押して移動させる。観客に最も見やすい角度は、参加者側とは限らない。",
      "Crossing wind shots push the safe gallery sideways. The clearest audience angle is usually not the participant's.",
    ),
  },
  {
    id: "boundary-fold",
    glyph: "境",
    kind: "fold",
    name: l("境界折返", "境界折返", "Boundary Foldback"),
    premise: l(
      "離場的彈幕從另一側回來；若沒有留下版本和方向標記，它也很擅長假裝自己從未離場。",
      "退場した弾が反対側から戻る。版と方向を記録しなければ、最初から退場していないふりも得意。",
      "Shots leaving one edge return from the other. Without version and direction marks, they excel at pretending they never left.",
    ),
  },
];

export const spellVenues = [
  {
    id: "hakurei-yard",
    name: l("博麗神社石庭", "博麗神社石庭", "Hakurei Shrine Stone Yard"),
    note: l("場地開闊；香客動線不能被臨時算成安全走廊。", "開けた会場。参拝者動線を臨時の安全回廊に数えてはならない。", "Open ground; the visitor path may not be reclassified as a safe corridor."),
    modifiers: { corridor: 0, workload: 0, fatigue: 0, readability: 1 },
  },
  {
    id: "misty-lake-bank",
    name: l("霧湖岸邊舞台", "霧の湖畔舞台", "Misty Lake Shore Stage"),
    note: l("側風與水面反光會把漂亮的提示變成另一套提示。", "横風と水面反射が、美しい予告を別の予告へ変える。", "Crosswind and lake glare can turn one beautiful cue into another."),
    modifiers: { corridor: -3, workload: 1, fatigue: 1, readability: -1 },
  },
  {
    id: "boundary-court",
    name: l("境界講堂試演場", "境界講堂試演場", "Boundary Hall Demonstration Court"),
    note: l("回彈標記清楚，但觀眾席偶爾位於場地的另一側。", "折返表示は明瞭だが、観客席が会場の反対側にあることがある。", "Return markers are clear, although the audience may occasionally occupy the other side of the venue."),
    modifiers: { corridor: -1, workload: 1, fatigue: 0, readability: 0 },
  },
  {
    id: "bamboo-clearing",
    name: l("迷途竹林月光空地", "迷いの竹林・月光広場", "Moonlit Bamboo Clearing"),
    note: l("低照度減少眩光，竹影卻會替彈幕添加未申報的第二層。", "低照度で眩光は減るが、竹影が未申告の第二層を弾幕へ加える。", "Low light reduces glare; bamboo shadows add an undeclared second layer."),
    modifiers: { corridor: -2, workload: 0, fatigue: -1, readability: -1 },
  },
];

export const spellCues = [
  {
    id: "ring-preview",
    name: l("輪廓先行", "輪郭先行", "Outline First"),
    note: l("第一波以前先畫出完整輪廓。", "第一波前に全輪郭を示す。", "Draw the whole outline before the first wave."),
    clarity: 3,
    flash: 0,
  },
  {
    id: "color-pulse",
    name: l("兩段色脈衝", "二段色パルス", "Two-Beat Colour Pulse"),
    note: l("用兩次顏色變化提示方向；反光場地可能吃掉第二次。", "二回の色変化で方向を示す。反射会場では二回目が消えることがある。", "Two colour changes signal direction; reflective venues may swallow the second."),
    clarity: 2,
    flash: 2,
  },
  {
    id: "freeze-trace",
    name: l("殘像軌跡", "残像軌跡", "Afterimage Trace"),
    note: l("保留上一波的淡色路徑；高密度時會變成一張很努力的謊言。", "前波の淡い経路を残す。高密度では、努力した嘘の地図になる。", "Keep a pale trace of the previous wave; at high density it becomes a very diligent lie."),
    clarity: 2,
    flash: 1,
  },
  {
    id: "declaration-only",
    name: l("只靠口頭宣言", "口頭宣言のみ", "Declaration Only"),
    note: l("畫面不給第二次提示；文喜歡標題，靈夢不喜歡事故報告。", "画面上の再提示なし。文は見出しを好み、霊夢は事故報告を好まない。", "No second visual cue. Aya likes the headline; Reimu dislikes the incident report."),
    clarity: 0,
    flash: 0,
  },
];

export const spellSounds = [
  {
    id: "quiet",
    name: l("無附加音壓", "追加音圧なし", "No Added Sound Pressure"),
    note: l("讓彈幕自己說話；妖精合唱團保留排練權。", "弾幕自身に語らせ、妖精合唱団の稽古権を残す。", "Let the danmaku speak; the fairy chorus keeps its rehearsal rights."),
    pressure: 0,
  },
  {
    id: "wood-chime",
    name: l("木片節拍", "木片拍子", "Wooden Beat"),
    note: l("每次變化前敲一次；跑拍會比沒有提示更糟。", "変化前に一打。拍がずれると無提示より悪い。", "One strike before every change; bad timing is worse than no cue."),
    pressure: 1,
  },
  {
    id: "temple-bell",
    name: l("小型鐘聲", "小鐘", "Small Temple Bell"),
    note: l("觀眾聽得懂，隔壁課堂也聽得懂。", "観客にも隣の授業にもよく聞こえる。", "Readable to the audience and to the class next door."),
    pressure: 2,
  },
  {
    id: "kappa-metal",
    name: l("河童金屬警報", "河童金属警報", "Kappa Metal Alarm"),
    note: l("機械絕不會漏掉變化；其他聲音也很難留下。", "機械は変化を見逃さない。他の音も残りにくい。", "The machine never misses a change; few other sounds survive it."),
    pressure: 4,
  },
];

export const spellReviewers = {
  reimu: {
    glyph: "規",
    name: l("博麗靈夢", "博麗霊夢", "Reimu Hakurei"),
    role: l("規則與退路", "規則と退路", "Rules & exits"),
    responses: {
      approve: l("規則先於彈幕出現，退路也不用猜。可以開始，再亂改我就停場。", "規則が弾より先に出て、退路も推測不要。始めてよい。勝手に変えたら止める。", "The rule arrives before the shots and the exit needs no guessing. Start it; change things mid-pattern and I stop the match."),
      caution: l("我看得見門，但不確定慢的人到達以前它還是不是門。", "門は見える。でも遅い人が着くまで門のままかは分からない。", "I can see the gate. I am not sure it remains a gate until a slower participant reaches it."),
      object: l("這不是退路，只是一個事後能被指出來的空白。先把規則寫清楚。", "これは退路ではなく、後から指差せる空白よ。先に規則を書きなさい。", "That is not an exit; it is empty space you can point at afterward. Write the rule first."),
    },
  },
  marisa: {
    glyph: "華",
    name: l("霧雨魔理沙", "霧雨魔理沙", "Marisa Kirisame"),
    role: l("表現力與重現", "表現力と再現", "Expression & reproducibility"),
    responses: {
      approve: l("有自己的輪廓，而且把種子、速度和場地寫下來了。這才叫下次還能更華麗。", "固有の輪郭があり、種・速度・会場も記録済み。次にもっと派手にできるってことだぜ。", "It has its own silhouette, and you wrote down the seed, speed, and venue. That means the next one can be even louder."),
      caution: l("好看，但你若只保存最好看的那一次，重現的是宣傳，不是符卡。", "綺麗だが、最高の一回だけ残すなら再現できるのは宣伝で、スペルカードじゃない。", "It looks good, but if you save only the best run, you are reproducing publicity, not the spell card."),
      object: l("把所有稜角磨掉不叫公平，叫還沒決定要表演什麼。給它一個能被認出的承諾。", "角を全部削るのは公平じゃなく、何を見せるか未決定なだけだ。識別できる約束を一つ作れ。", "Sanding off every edge is not fairness; it means you have not chosen what to perform. Give it one recognisable promise."),
    },
  },
  aya: {
    glyph: "聞",
    name: l("射命丸文", "射命丸文", "Aya Shameimaru"),
    role: l("觀眾可讀性", "観客可読性", "Audience readability"),
    responses: {
      approve: l("第一張照片就能說明規則，第二張才需要標題。這很少見，值得頭版。", "一枚目で規則が分かり、二枚目で初めて見出しが要る。珍しい。第一面向きです。", "The first photograph explains the rule; only the second needs a headline. Rare, and front-page material."),
      caution: l("參與者懂了，觀眾只看見一片漂亮的逃跑。我要一個不靠事後圖說的提示。", "参加者は理解したが、観客には美しい逃走しか見えない。事後説明に頼らない予告が必要です。", "The participant understood. The audience saw only a beautiful escape. I need a cue that does not rely on the caption afterward."),
      object: l("如果必須把完整規則塞進標題，畫面本身就還沒有報導清楚。", "完全な規則を見出しへ詰める必要があるなら、画面自体がまだ報じ切れていません。", "If the complete rule must fit in my headline, the picture has not reported itself clearly."),
    },
  },
  nitori: {
    glyph: "機",
    name: l("河城荷取", "河城にとり", "Nitori Kawashiro"),
    role: l("效能與碰撞穩定", "性能と当たり判定", "Performance & collision stability"),
    responses: {
      approve: l("彈數留在預算內，碰撞核和畫面版本也鎖好了。別碰那條有膠帶的線就很穩。", "弾数は予算内、当たり核と表示版も固定済み。テープの線に触らなければ安定だよ。", "Projectile count is within budget and the collision/display versions are locked. It is stable if nobody touches the taped wire."),
      caution: l("現在跑得動，但隨機幅度和變化頻率同時再加一格，碰撞記錄就會比彈幕晚到。", "今は動く。でも乱数幅と変化頻度を同時に一段上げると、当たり記録が弾より遅れる。", "It runs now. Raise randomness and change rate together and the collision log will arrive after the bullet."),
      object: l("你設計的是符卡，不是讓幀率自己成為第二階段。先砍彈數或鎖種子。", "設計しているのはスペルカードで、フレームレートを第二段階にする装置じゃない。弾数を削るか種を固定して。", "You are designing a spell card, not a device where frame rate becomes phase two. Cut the count or lock the seed."),
    },
  },
  eirin: {
    glyph: "診",
    name: l("八意永琳", "八意永琳", "Eirin Yagokoro"),
    role: l("光刺激、疲勞與停止", "光刺激・疲労・停止", "Light, fatigue & stopping"),
    responses: {
      approve: l("刺激、時長和停止手勢都在可預期範圍。這是可以拒絕、也可以中途退出的設計。", "刺激・時間・停止合図が予測範囲内。拒否も途中離脱も可能な設計です。", "Stimulation, duration, and stop signal are predictable. This design can be refused and left midway."),
      caution: l("一次試演可以；連續場次必須加休息，且不能把閉眼當作唯一的安全措施。", "一回の試演は可。連続実演には休憩が必要で、閉眼を唯一の安全策にしてはいけません。", "One demonstration is possible. Repeated runs require rest, and closing one's eyes cannot be the only safeguard."),
      object: l("警告不會抵消過量刺激。可以留在研究模擬裡，不能把人帶進去證明它沒問題。", "警告は過剰刺激を相殺しません。研究模擬には残せますが、人を入れて無害を証明してはいけません。", "A warning does not cancel excessive stimulation. Keep it in research simulation; do not put people inside to prove it harmless."),
    },
  },
  fairies: {
    glyph: "唱",
    name: l("霧湖妖精合唱團", "霧の湖妖精合唱団", "Misty Lake Fairy Chorus"),
    role: l("共場、聲音與玩心", "共用会場・音・遊び", "Shared space, sound & play"),
    responses: {
      approve: l("我們能在旁邊唱完第二段，而且琪露諾找到了一條你沒畫出來的路。算好玩。", "隣で二番まで歌えるし、チルノは図にない道を見つけた。面白いってこと。", "We can sing the second verse beside it, and Cirno found a route you did not draw. That counts as fun."),
      caution: l("節拍能跟，但每次換形都搶走第一拍。要嘛留一口氣，要嘛讓我們負責敲木片。", "拍には乗れるが、形が変わるたび一拍目を奪う。一息残すか、木片を私たちに任せて。", "We can follow the beat, but every shape change steals beat one. Leave us a breath or let us strike the wooden cue."),
      object: l("這不是『大家都能看見的表演』，是把旁邊所有聲音凍死。最強也要先留排練時間。", "これは『皆が見られる実演』じゃなく、隣の音を全部凍らせるもの。最強でも稽古時間は残して。", "This is not a performance everyone can see; it freezes every sound nearby. Even the strongest must leave rehearsal time."),
    },
  },
};

const option = (id, label, note, effects = {}) => ({ id, label, note, effects });

export const spellDefenceRounds = {
  rule: {
    examinerId: "reimu",
    role: l("第一問・退路是否仍是規則", "第一問・退路はまだ規則か", "Question I · Is the exit still a rule?"),
    prompt: l(
      "變化後的安全走廊比宣言時更窄。你願意把哪一項寫成不可臨時更改的規則？",
      "変化後、安全回廊は宣言時より狭い。どの項目を臨時変更不可の規則にしますか。",
      "After a change, the safe corridor is narrower than declared. What will you make a rule that cannot change mid-performance?",
    ),
    choices: [
      option("reserve", l("保留最低走廊，即使破壞對稱", "対称性を崩しても最低回廊を確保", "Reserve the minimum corridor, even if symmetry breaks"), l("靈夢得到明確退路；魔理沙會要求你解釋那個缺口。", "霊夢は明確な退路を得る。魔理沙はその欠けを説明せよと言う。", "Reimu gets a real exit; Marisa will ask you to explain the gap."), { rule: 3, care: 2, spectacle: -1 }),
      option("adaptive", l("讓走廊移動，但每次先給雙重提示", "回廊を移動させ、毎回二重予告", "Move the corridor, but precede every move with two cues"), l("保留變化，也把可讀性變成必須驗證的承諾。", "変化を残し、可読性を検証必須の約束にする。", "Keeps the variation while turning readability into a promise that must be tested."), { rule: 2, care: 1, spectacle: 1, method: 1 }),
      option("advanced-only", l("保留設計，限定進階公開場", "設計を残し、上級公開枠に限定", "Keep the design and limit it to an advanced public session"), l("不是所有人都必須參加，但限制必須在報名前可見。", "全員参加は不要だが、制限は申込前に見えなければならない。", "Not everyone must participate, but the restriction must be visible before sign-up."), { rule: 1, care: 1, scope: 2 }),
      option("resolve-later", l("先演出，事故後再決定哪裡算出口", "先に実演し、事故後に出口を決める", "Perform first; decide what counted as an exit after the incident"), l("文已經替這個答案留了頭版位置。", "文はこの回答のために第一面を空けている。", "Aya has already reserved the front page for this answer."), { spectacle: 2, rule: -4, care: -3 }),
    ],
  },
  reproducibility: {
    examinerId: "marisa",
    role: l("第二問・別人能否重現", "第二問・他者が再現できるか", "Question II · Can somebody else reproduce it?"),
    prompt: l(
      "你的最好一次試飛非常漂亮。你要公開什麼，才能讓下一個人重現設計而不是只重播宣傳？",
      "最高の試飛は非常に美しい。次の人が宣伝でなく設計を再現するため、何を公開しますか。",
      "Your best test flight is beautiful. What will you publish so the next person reproduces the design, not merely its publicity?",
    ),
    choices: [
      option("publish-seed", l("種子、參數、碰撞版本與場地條件", "種・パラメータ・当たり版・会場条件", "Seed, parameters, collision version, and venue conditions"), l("失敗場次也一起列入。", "失敗した回も併記する。", "Failed runs are included."), { method: 3, repro: 4, spectacle: 0 }),
      option("publish-rig", l("公開裝置與校準，但保留隨機種子", "装置と校正を公開、乱数種は保留", "Publish the rig and calibration, but keep the random seed"), l("荷取能重建機器，不能保證重建同一張天空。", "にとりは装置を再建できるが、同じ空は保証できない。", "Nitori can rebuild the machine, not guarantee the same sky."), { method: 2, repro: 1, spectacle: 1 }),
      option("best-video", l("只公開最好看的錄像", "最も美しい映像だけ公開", "Publish only the best-looking recording"), l("文得到一篇好報導；方法欄仍然空白。", "文は良い記事を得るが、方法欄は空白のまま。", "Aya gets a good story; the methods field stays blank."), { spectacle: 3, repro: -3, method: -2 }),
      option("trade-secret", l("都不公開，標成魔法使秘方", "非公開、魔法使い秘伝と表示", "Publish nothing; label it a magician's trade secret"), l("可以表演，不能聲稱別人已驗證。", "実演はできるが、他者検証済みとは言えない。", "It may be performed, but not described as independently verified."), { scope: 1, repro: -4, method: -2 }),
    ],
  },
  aya: {
    examinerId: "aya",
    role: l("第三問・觀眾看見了什麼", "第三問・観客は何を見たか", "Question III · What did the audience see?"),
    prompt: l("參與者靠低速看懂了，觀眾只拍到一片光。你如何證明提示不是事後才被解釋出來？", "参加者は低速で読めたが、観客写真は光だけ。予告が事後解釈でないとどう示しますか。", "The participant read it at low speed; the audience photographed only light. How do you show that the cue was not invented afterward?"),
    choices: [
      option("audience-map", l("演出前公開一張不含答案的提示圖", "実演前に答えを含まない予告図を公開", "Publish a cue map without the solution before the performance"), l("觀眾知道該看哪裡，但仍要自己讀。", "観客は見る場所を知るが、読み取りは自分で行う。", "The audience knows where to look but must still read it."), { readability: 3, method: 2 }),
      option("blind-coders", l("讓未看設計的人獨立標記提示時間", "設計未見者に予告時刻を独立符号化", "Have design-blind observers independently mark cue timing"), l("新聞照片成為資料之一，不是裁判。", "新聞写真は資料の一つで、判定者ではない。", "The newspaper photograph becomes evidence, not judge."), { readability: 2, method: 4 }),
      option("better-headline", l("請文把規則全部寫進標題", "文に規則全部を見出しへ書かせる", "Ask Aya to put the whole rule in the headline"), l("標題可能比符卡先擊中讀者。", "見出しが弾より先に読者へ当たるかもしれない。", "The headline may hit readers before the danmaku does."), { spectacle: 2, readability: -2 }),
    ],
  },
  nitori: {
    examinerId: "nitori",
    role: l("第三問・第二階段是不是幀率", "第三問・第二段階はフレーム率か", "Question III · Is phase two just frame rate?"),
    prompt: l("壓力測試時，碰撞記錄比畫面晚半拍。你先犧牲什麼？", "負荷試験で当たり記録が表示より半拍遅れた。最初に何を削りますか。", "Under load, collision records trail the display by half a beat. What do you sacrifice first?"),
    choices: [
      option("cap-budget", l("限制同屏彈數並鎖定碰撞版本", "同時弾数を制限し当たり版を固定", "Cap simultaneous shots and lock the collision version"), l("畫面少一層，規則仍是同一張。", "画面は一層減るが、規則は同じまま。", "The picture loses a layer; the rule stays the same."), { care: 2, method: 3, stability: 4, spectacle: -1 }),
      option("lower-effects", l("保留彈路，先減少殘像與裝飾", "弾路を残し、残像と装飾を先に削減", "Keep trajectories; reduce afterimages and decoration first"), l("文會抱怨照片，參與者不會撞上延遲。", "文は写真に不満だが、参加者は遅延に衝突しない。", "Aya dislikes the photograph; the participant avoids delayed collision."), { care: 2, stability: 3, readability: 1 }),
      option("more-tape", l("加兩條河童膠帶並提高警報音量", "河童テープ二本と警報音量を追加", "Add two strips of kappa tape and raise the alarm volume"), l("荷取要求記錄顯示：她沒有推薦這個答案。", "にとりは、この回答を推奨していないと記録せよと要求。", "Nitori asks the record to state that she did not recommend this."), { stability: -3, care: -2, spectacle: 1 }),
    ],
  },
  eirin: {
    examinerId: "eirin",
    role: l("第三問・警告能否抵消刺激", "第三問・警告は刺激を相殺するか", "Question III · Does a warning cancel stimulation?"),
    prompt: l("試演的光刺激與時長超出一般公開場條件。你如何保留研究，而不是拿參與者證明它安全？", "光刺激と時間が一般公開条件を超える。参加者で安全を証明せず、研究をどう残しますか。", "Light load and duration exceed ordinary public conditions. How do you preserve the research without using participants to prove it safe?"),
    choices: [
      option("closed-simulation", l("改為封閉模擬，保留設計但不公開試飛", "閉鎖模擬へ変更、設計は保存し公開試飛なし", "Move to closed simulation; preserve the design without public flight"), l("否決公開演出，不否決研究問題。", "公開実演を否決し、研究課題は否決しない。", "Rejects public performance, not the research question."), { care: 5, method: 2, scope: 2 }),
      option("short-session", l("縮短時長、降低閃爍並安排可離場休息", "時間短縮・閃光低減・途中離脱休憩", "Shorten duration, reduce flashing, and provide exit/rest"), l("修改後重新量測，不沿用舊風險結論。", "修正後に再測定し、旧リスク結論を流用しない。", "Measure again after revision; do not reuse the old risk conclusion."), { care: 4, method: 3, spectacle: -1 }),
      option("stronger-warning", l("不修改，只把警告寫得更大", "変更せず警告だけ大きくする", "Change nothing; make the warning larger"), l("警告仍然不會吸收光或疲勞。", "警告は光も疲労も吸収しない。", "The warning still absorbs neither light nor fatigue."), { care: -4, spectacle: 1 }),
    ],
  },
  fairies: {
    examinerId: "fairies",
    role: l("第三問・共用場地還剩多少聲音", "第三問・共用会場に音は残るか", "Question III · Is any sound left in the shared venue?"),
    prompt: l("警報和變化節拍蓋過霧湖排練。你把誰的時間算進符卡規則？", "警報と変化拍が霧の湖の稽古を覆う。誰の時間をスペルカード規則へ数えますか。", "Alarm and change beats cover Misty Lake rehearsal. Whose time belongs inside the spell-card rule?"),
    choices: [
      option("shared-count", l("把合唱休息與演出節拍寫進同一張時序表", "合唱休止と実演拍を同じ時系列表へ", "Put chorus breaks and performance beats on one timeline"), l("共同場地不再被當作設計外的空白。", "共用会場を設計外の空白として扱わない。", "Shared space stops being blank outside the design."), { care: 3, method: 2, play: 2 }),
      option("wood-cue", l("取消金屬警報，由妖精負責木片提示", "金属警報をやめ、妖精が木片予告を担当", "Replace the metal alarm with fairy-run wooden cues"), l("提示可能更有玩心，也必須把跑拍記進版本。", "予告は楽しくなるが、拍ずれも版記録へ入れる必要。", "Cues gain play; missed beats must enter version history."), { care: 2, play: 4, reproducibility: 1 }),
      option("sing-louder", l("要求合唱團唱得比警報更大聲", "合唱団へ警報より大声を要求", "Require the chorus to sing louder than the alarm"), l("琪露諾接受挑戰；醫療側沒有。", "チルノは挑戦を受ける。医療側は受けない。", "Cirno accepts the challenge. Medical review does not."), { care: -3, spectacle: 2 }),
    ],
  },
};

export function spellPattern(id) {
  return spellPatterns.find((item) => item.id === id);
}

export function spellVenue(id) {
  return spellVenues.find((item) => item.id === id);
}

export function spellCue(id) {
  return spellCues.find((item) => item.id === id);
}

export function spellSound(id) {
  return spellSounds.find((item) => item.id === id);
}
