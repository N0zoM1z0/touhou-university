const l = (zh, ja, en) => ({ "zh-Hant": zh, ja, en });

export const identityKinds = {
  human: l("人類", "人間", "Human"),
  youkai: l("妖怪", "妖怪", "Youkai"),
  fairy: l("妖精", "妖精", "Fairy"),
  magician: l("魔法使", "魔法使い", "Magician"),
  spirit: l("幽靈／靈體", "幽霊・霊体", "Ghost / spirit"),
  lunar: l("月之民／月兔", "月人・月兎", "Lunarian / moon rabbit"),
  other: l("其他／尚未決定", "その他・未定", "Other / undecided"),
};

export const originKinds = {
  gensokyo: l("幻想鄉居民", "幻想郷在住", "Gensokyo resident"),
  outside: l("外界來訪者", "外の世界から", "Outside World visitor"),
  lunar: l("月面與月都", "月面・月の都", "Moon / Lunar Capital"),
  shifting: l("居所會移動", "住居が移動する", "Residence moves"),
};

export const committeeBySchool = {
  boundary: ["yukari", "reimu", "keine"],
  history: ["keine", "aya", "reimu"],
  magic: ["patchouli", "marisa", "reimu"],
  medicine: ["eirin", "reimu", "keine"],
  engineering: ["nitori", "marisa", "aya"],
  journalism: ["aya", "keine", "reimu"],
  policy: ["byakuren", "kanako", "miko"],
};

export const reviewers = {
  reimu: {
    name: l("博麗 靈夢", "博麗 霊夢", "Reimu Hakurei"),
    role: l("異變應對實務教授", "異変対応実務 教授", "Professor of Incident Response"),
    stance: "condition",
    note: l(
      "可以做，但禁止以「異變處理」名義跳過退路與 no-Bomb 條件。若測試打穿神社結界，研究室自己修。",
      "実施は可。ただし「異変対応」を理由に退路や no-Bomb 条件を省略しないこと。神社の結界を破損した場合は研究室で修復。",
      "Proceed, but incident response is not an excuse to skip exit conditions or a no-Bomb constraint. If the shrine barrier breaks, the lab repairs it.",
    ),
  },
  yukari: {
    name: l("八雲 紫", "八雲 紫", "Yukari Yakumo"),
    role: l("結界研究創院教授", "境界研究 創設教授", "Founding Professor of Boundary Studies"),
    stance: "approve",
    note: l(
      "問題已經碰到一條值得研究的邊界。批准進入面試；至於面試在校內還是校外，屆時再定義。",
      "研究に値する境界へ到達している。面接へ進める。ただし面接が学内か学外かは当日に定義する。",
      "The question has reached a boundary worth studying. Approved for interview; whether the interview is inside or outside campus will be defined that day.",
    ),
  },
  keine: {
    name: l("上白澤 慧音", "上白沢 慧音", "Keine Kamishirasawa"),
    role: l("歷史記錄學院院長", "歴史記録学部長", "Dean of History and Records"),
    stance: "revise",
    note: l(
      "請把「發生了什麼」「誰留下記錄」與「哪一版被允許保存」分成三欄。現在的方法仍會把後來的敘述當成當時的證據。",
      "「何が起きたか」「誰が記録したか」「どの版が保存を許されたか」を三欄に分けること。現状では後世の叙述を当時の証拠として扱ってしまう。",
      "Separate what happened, who recorded it, and which version was allowed to remain. The current method still treats later narration as contemporary evidence.",
    ),
  },
  patchouli: {
    name: l("帕秋莉・諾蕾姬", "パチュリー・ノーレッジ", "Patchouli Knowledge"),
    role: l("元素理論教授", "元素理論 教授", "Professor of Elemental Theory"),
    stance: "revise",
    note: l(
      "「很難」不是可操作變量。請區分彈幕可讀性、控制延遲、路徑求解與資源限制，再說明哪一項能被反證。",
      "「難しい」は操作可能な変数ではない。弾幕の可読性、操作遅延、経路探索、資源制約を分け、反証可能な項目を示すこと。",
      "“Difficult” is not an operational variable. Separate danmaku readability, control latency, route solving, and resource limits, then identify what can be falsified.",
    ),
  },
  marisa: {
    name: l("霧雨 魔理沙", "霧雨 魔理沙", "Marisa Kirisame"),
    role: l("應用魔法教授", "応用魔法 教授", "Professor of Applied Magic"),
    stance: "approve",
    note: l(
      "方法能跑就先跑。正式試驗前交三次可重現失敗，還有材料來源；「森林裡撿的」這次只能算半欄。",
      "動く方法ならまず試せ。正式実験前に再現可能な失敗を三回と素材出典を提出。「森で拾った」は今回は半欄扱い。",
      "If the method runs, run it. Submit three reproducible failures and material provenance before the formal trial; “found in the forest” counts as half a field.",
    ),
  },
  eirin: {
    name: l("八意 永琳", "八意 永琳", "Eirin Yagokoro"),
    role: l("月都醫藥生命學院院長", "月都医薬生命学部長", "Dean of Lunar Medicine"),
    stance: "approve",
    note: l(
      "研究問題可以進入下一階段。月相反應與疲勞必須各自記錄；住宿暫排竹林診療線附近，不得跟隨第四盞燈。",
      "次段階へ進める。月相反応と疲労は別々に記録すること。住居は竹林診療経路付近を仮指定し、第四の灯りには従わないこと。",
      "The question may proceed. Record lunar response separately from fatigue. Housing is provisionally near the bamboo clinic route; do not follow the fourth lantern.",
    ),
  },
  nitori: {
    name: l("河城 荷取", "河城 にとり", "Nitori Kawashiro"),
    role: l("河童工程學院院長", "河童工学部長", "Dean of Kappa Engineering"),
    stance: "approve",
    note: l(
      "原型可以做。請把輸入、輸出、故障時間戳和膠帶批次一起記；如果盒子打不開，就不算可維修。",
      "試作可。入力、出力、故障時刻、テープのロットを同時に記録すること。箱が開かなければ整備可能とは認めない。",
      "Prototype approved. Log inputs, outputs, failure timestamps, and tape batch together. If the box cannot be opened, it is not maintainable.",
    ),
  },
  aya: {
    name: l("射命丸 文", "射命丸 文", "Aya Shameimaru"),
    role: l("天狗新聞傳播學院院長", "天狗新聞報道学部長", "Dean of Tengu Journalism"),
    stance: "revise",
    note: l(
      "摘要很適合頭版，因此尤其需要先縮小主張。請在我替你想好標題之前補上來源鏈與公開訂正方案。",
      "一面向きの要旨だからこそ主張を絞る必要がある。こちらが見出しを決める前に、情報源の連鎖と公開訂正計画を追加すること。",
      "The abstract belongs on page one, which is exactly why its claim must shrink. Add a source chain and public-correction plan before I invent the headline.",
    ),
  },
  byakuren: {
    name: l("聖 白蓮", "聖 白蓮", "Byakuren Hijiri"),
    role: l("共生實務輪值教授", "共生実務 輪番教授", "Rotating Professor of Coexistence Practice"),
    stance: "approve",
    note: l(
      "問題願意看見不同身體與壽命承擔的成本，可以繼續。下一版請把不會留下文字的人也列入方法。",
      "異なる身体と寿命が負う費用を見ている点を評価する。次稿では文字を残さない者も方法に含めること。",
      "The question recognizes costs borne by different bodies and lifespans. Proceed, but include those who leave no written record in the next method.",
    ),
  },
  kanako: {
    name: l("八坂 神奈子", "八坂 神奈子", "Kanako Yasaka"),
    role: l("信仰基礎設施輪值教授", "信仰基盤 輪番教授", "Rotating Professor of Faith Infrastructure"),
    stance: "condition",
    note: l(
      "理念可以，資源表不行。請補上誰供電、誰維修、誰在祭典日取得優先權；信仰不會替缺少的預算欄供能。",
      "理念はよいが資源表が足りない。給電、整備、祭日の優先権を誰が担うか追記すること。信仰は空欄の予算を発電しない。",
      "The principle is sound; the resource table is not. Name who powers, repairs, and receives festival priority. Faith does not generate an omitted budget line.",
    ),
  },
  miko: {
    name: l("豐聰耳 神子", "豊聡耳 神子", "Toyosatomimi no Miko"),
    role: l("公共領導輪值教授", "公共指導 輪番教授", "Rotating Professor of Public Leadership"),
    stance: "revise",
    note: l(
      "我聽見了十一種願望，但申請只回答了其中三種。請公開你不準備滿足哪些要求，以及由誰承擔這個決定。",
      "十一の望みが聞こえるが、出願は三つにしか答えていない。満たさない要求と、その判断を誰が負うかを公開すること。",
      "I hear eleven desires, but the application answers only three. State which requests you will not satisfy and who bears that decision.",
    ),
  },
};

export const reviewerCommentary = {
  reimu: {
    question: l("先說清楚這件事從哪一步起算異變、又在哪一步不歸我管。問題可以怪，責任邊界不能只畫在神社門外。", "どの段階から異変で、どの段階から私の担当外かを先に示すこと。問いは奇妙でもよいが、責任境界を神社の外だけに引かない。", "State where this becomes an incident and where it stops being my problem. The question may be strange; the responsibility boundary may not simply sit outside the shrine."),
    method: l("方法裡要有一條真的能停手、收拾現場並回去吃飯的路。只有開始條件，沒有退出條件，不准。", "方法には本当に停止し、片付け、食事へ戻れる経路が必要。開始条件だけで終了条件がないものは不可。", "The method needs a real way to stop, clean up, and get back to dinner. Start conditions without exit conditions are not approved."),
    needs: l("需求欄寫多少都可以，但不要把免費場地、免費修繕與免費巫女當成同一項資源。", "希望欄はいくら書いてもよいが、無料会場・無料修理・無料巫女を同じ資源として数えないこと。", "Ask for what you need, but do not count a free venue, free repairs, and a free shrine maiden as one resource."),
  },
  yukari: {
    question: l("這個問題真正有趣的是它偷偷假定了哪一側固定。面試時請帶一個當假定失效後仍能成立的版本。", "この問いの面白さは、どちら側を密かに固定しているかにある。面接には、その仮定が崩れても成立する版を持参すること。", "The interesting part is which side the question quietly holds fixed. Bring a version that still works when that assumption fails."),
    method: l("你寫的觀察位置似乎只有一個地址。請再說明地址兩側交換時，誰仍是觀察者。", "観察位置は一つの住所しか持たないようだ。住所の両側が入れ替わった時、誰が観察者のままかを示してほしい。", "Your observation point appears to have only one address. Explain who remains the observer when the two sides of that address exchange places."),
    needs: l("支援需求可以批准；但「靠近」與「可抵達」不是同一份住宿條件。境界研究院將保留重新解釋其中一項的權利。", "支援希望は承認可能。ただし「近い」と「到達可能」は同じ住居条件ではない。境界研究院はいずれか一方を再解釈する権利を留保する。", "Support can be approved, but near and reachable are not the same housing condition. Boundary Studies reserves the right to reinterpret one of them."),
  },
  keine: {
    question: l("請把問題中的事件、記錄者與後來的解釋分開。現在至少有一句話可能把回憶當成當日紀錄。", "問いの出来事・記録者・後世の解釈を分けること。少なくとも一文が回想を当日記録として扱う可能性がある。", "Separate the event, its recorder, and the later interpretation. At least one sentence may be treating recollection as a same-day record."),
    method: l("方法可行，但每次訂正都要保留前一版與日期。沒有版本的正確答案，對史學館而言仍是不明來源。", "方法は実行可能。ただし訂正ごとに前版と日付を残すこと。版のない正答は史学館では出典不明のまま。", "The method can run, but every correction must retain the previous version and date. A correct answer without a version remains unsourced."),
    needs: l("需求會寫入檔案；未填的部分也會被記成『申請時未申報』，不准日後改寫成『向來如此』。", "希望は記録する。空欄も「出願時未申告」と記し、後から「昔からそうだった」へ書き換えない。", "Needs will enter the record. Blank fields are recorded as not declared at application, not later rewritten as always having been so."),
  },
  patchouli: {
    question: l("問題裡至少混有兩個可分開變動的量。請先替它們命名，再決定哪一個值得消耗魔力。", "問いには独立に動き得る量が少なくとも二つ混ざっている。まず命名し、どちらに魔力を使う価値があるか決めること。", "The question mixes at least two quantities that can vary separately. Name them before deciding which deserves magical expenditure."),
    method: l("觀察不是方法的同義詞。請補比較條件、失敗判準，以及讀到相反結果時準備放棄哪一句主張。", "観察は方法の同義語ではない。比較条件、失敗基準、逆の結果が出た時に捨てる主張を追記すること。", "Observation is not a synonym for method. Add a comparison, a failure rule, and the claim you will abandon if the result reverses."),
    needs: l("設備需求可以討論；材料批次、保存條件與借出期限必須先進表格。圖書館不接受『應該還在』。", "設備希望は協議可能。素材ロット、保存条件、返却期限を先に表へ入れること。図書館は「まだあるはず」を受け付けない。", "Equipment needs are negotiable. Put material batch, storage condition, and return date in the table first. The library does not accept should still be there."),
  },
  marisa: {
    question: l("這問題看起來能做，而且可能會炸掉原本的答案——很好。先交一個最便宜、最快失敗的版本。", "この問いは実行できそうで、元の答えを吹き飛ばすかもしれない――いい。まず最安で最速に失敗する版を出せ。", "This looks runnable and may blow up the original answer—good. Submit the cheapest version that can fail quickly."),
    method: l("步驟有了，還缺別人照著做也會失敗在同一處的記錄。材料來源請寫完整，森林不是供應商名稱。", "手順はある。次は他人も同じ場所で失敗できる記録が必要だ。素材出典は完全に書け。森は業者名じゃない。", "You have steps; now make a record that lets someone else fail in the same place. Give full provenance. Forest is not a supplier name."),
    needs: l("想借的東西先列出來，我會告訴你哪些能借、哪些已經被我借了。住宿若靠近工房，別抱怨半夜的可重現噪音。", "借りたい物を列挙しろ。貸せる物と、すでに私が借りている物を教える。工房近くの住居なら夜中の再現可能騒音に文句を言うな。", "List what you want to borrow; I will say what is available and what I already borrowed. If housed near the workshop, do not complain about reproducible midnight noise."),
  },
  eirin: {
    question: l("問題可以進下一階段，但目前把個體差、月相與疲勞寫在同一句。三者必須各有自己的記錄欄。", "問いは次段階へ進めるが、個体差・月相・疲労が同じ文に入っている。三者を別の記録欄に分けること。", "The question may proceed, but individual variation, lunar phase, and fatigue currently share one sentence. Give each its own field."),
    method: l("先寫停止條件，再寫劑量或暴露。受試者說『大概沒事』時，方法不能把它自動編碼成沒事。", "中止条件を先に、用量・曝露を後に書くこと。対象者の「たぶん平気」を自動的に平気と符号化しない。", "Write stopping conditions before dose or exposure. A participant saying probably fine must not be automatically encoded as fine."),
    needs: l("需求可安排，但醫療、月相降載與普通熬夜補救是三張不同的單。帝若把它們訂在一起，請直接交給鈴仙。", "希望は調整可能。ただし医療、月相低刺激、普通の夜更かし対策は別票。てゐが綴じた場合は鈴仙へ直接渡すこと。", "Support can be arranged, but medical care, lunar load reduction, and ordinary sleep-loss recovery are separate slips. If Tewi staples them together, hand them to Reisen."),
  },
  nitori: {
    question: l("這個問題可以做成原型。請先說明輸入、輸出，以及盒子冒煙時哪一項仍算成功。", "この問いは試作できる。入力、出力、箱から煙が出た時に何を成功と数えるかを先に示すこと。", "This can become a prototype. Define input, output, and what still counts as success when smoke leaves the box."),
    method: l("把故障時間戳、版本號與膠帶批次加進步驟。只拍完成照的機器，通常是在照片之間壞掉的。", "故障時刻、版番号、テープロットを手順へ追加。完成写真だけの機械は、たいてい写真の間で壊れる。", "Add failure timestamp, version, and tape batch. Machines documented only by finished photos usually break between photographs."),
    needs: l("工房席位與水路可以排，但維修空間必須算進需求。打不開的漂亮盒子不叫可維修，只叫比較貴。", "工房席と水路は調整可能だが、整備空間も希望へ含めること。開かない綺麗な箱は整備可能でなく、ただ高い。", "Workshop space and water access can be scheduled, but maintenance clearance belongs in the request. A pretty box that cannot open is not maintainable, only expensive."),
  },
  aya: {
    question: l("這個問題已經像標題，但還不像可被訂正的標題。請指出哪項新證據會迫使你換掉動詞。", "問いはすでに見出しらしいが、訂正可能な見出しではない。どの新証拠で動詞を変更するか示すこと。", "The question already sounds like a headline, but not a correctable one. State what new evidence would force you to replace its verb."),
    method: l("消息來源、觀察者與轉述者要分三欄。匿名可以保留，沒有來源鏈不可以；這條規則也適用於我的報紙。", "情報源、観察者、伝聞者を三欄に分ける。匿名は可、出所連鎖なしは不可。この規則は私の新聞にも適用される。", "Separate source, observer, and relayer. Anonymous is allowed; no source chain is not. This rule also applies to my newspaper."),
    needs: l("公開需求前請先標出不能公開的部分。若你留白，我會假定那裡適合放標題；這通常對雙方都不好。", "公開希望の前に非公開部分を示すこと。空欄なら見出し向きと判断するが、通常は双方に良くない。", "Mark what cannot be public before listing public needs. If left blank, I may assume the space suits a headline; that is usually bad for both sides."),
  },
  byakuren: {
    question: l("問題看見了差異，但尚未說明誰承擔比較的代價。請把壽命、身體與無法留下文字的人納入。", "問いは差異を見ているが、比較の費用を誰が負うかがない。寿命、身体、文字を残せない者を含めること。", "The question sees difference but not who bears the cost of comparison. Include lifespan, body, and those unable to leave text."),
    method: l("方法若要求所有人用同一方式參與，就只是在把方便當成公平。請保留至少一條不同身體也能完成的路。", "全員に同じ参加方法を求めるなら、便利を公平と呼んでいるだけ。異なる身体でも完了できる経路を一つ残すこと。", "If everyone must participate identically, convenience is being called fairness. Keep at least one path a different body can complete."),
    needs: l("支援不是審查後才補的附件。把飲食、通行與休息寫進主要方案，否則最先被排除的人不會出現在結果裡。", "支援は審査後の添付ではない。食事、通行、休息を本案へ入れなければ、最初に除外された者は結果に現れない。", "Support is not an attachment added after review. Put food, access, and rest in the main plan or those excluded first will never appear in the results."),
  },
  kanako: {
    question: l("理念夠大，現在請把它接到一條真的會供電、供水或供人的管線。公共性不能只靠標題發電。", "理念は十分大きい。次は実際に電力・水・人員を供給する線へ接続すること。公共性は見出しだけでは発電しない。", "The principle is large enough. Connect it to a line that supplies power, water, or people. Public value does not generate electricity from a title."),
    method: l("方法要寫誰維護、何時停機、祭典日誰有優先權。沒有運轉表的共識，通常只是別人的加班。", "保守担当、停止時刻、祭日の優先権を方法へ書くこと。運転表のない合意は、たいてい誰かの残業である。", "Name maintenance, shutdown time, and festival priority. Consensus without an operating schedule is usually someone else’s overtime."),
    needs: l("資源可以談，但請分清必要容量、想要容量與神奈子認為遲早會需要的容量。三者的預算欄不同。", "資源は協議可能。ただし必要容量、希望容量、神奈子がいずれ必要と考える容量を分けること。予算欄は別々だ。", "Resources are negotiable, but separate required capacity, desired capacity, and capacity Kanako believes you will eventually need. They occupy different budget lines."),
  },
  miko: {
    question: l("我聽見的願望比問題欄寫出的更多。請說明哪些願望不會被這項研究滿足，以及由誰公開說不。", "問いに書かれた以上の願いが聞こえる。どの願いを満たさず、誰が公に断るかを示すこと。", "I hear more desires than the question declares. State which will not be satisfied and who will publicly say no."),
    method: l("方法列出了行動，卻沒有列決定者。每個轉折都要有人承擔；『大家同意』不是一個可傳喚的名字。", "方法には行動があるが決定者がない。各分岐には責任者が必要で、「皆の合意」は召喚できる名前ではない。", "The method lists actions but not decision-makers. Every turn needs an accountable person; everyone agreed is not a name that can be summoned."),
    needs: l("需求裡的優先順序不能只在衝突發生後才出現。請現在排序，免得我同時聽見十一個人都說自己先。", "希望の優先順は衝突後に初めて現れてはならない。今並べること。十一人が同時に自分が先だと言うのを避けたい。", "Priorities cannot first appear after conflict. Rank them now; I would rather not hear eleven people simultaneously claim to be first."),
  },
};
