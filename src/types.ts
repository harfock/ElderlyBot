export interface InstructionItem {
  id: string;
  emoji: string;
  // Default Mandarin fields
  title: string;
  shortText: string;
  fullTip: string;
  voiceText: string;
  // Authentic Cantonese fields
  titleCantonese?: string;
  shortTextCantonese?: string;
  fullTipCantonese?: string;
  voiceTextCantonese?: string;
}

export interface CategoryGroup {
  id: string;
  icon: string;
  // Default Mandarin fields
  name: string;
  description: string;
  // Authentic Cantonese fields
  nameCantonese?: string;
  descriptionCantonese?: string;
  items: InstructionItem[];
}

export const INSTRUCTION_CATEGORIES: CategoryGroup[] = [
  {
    id: "exercise",
    name: "🏋️ 運動時刻",
    nameCantonese: "🏋️ 運動時間",
    icon: "dumbbell",
    description: "適合長輩的舒緩關節運動，活動筋骨更精神",
    descriptionCantonese: "啱健康長者做嘅舒緩關節運動，鬆下筋骨成個人更醒神",
    items: [
      {
        id: "ex_head",
        emoji: "🧘‍♂️",
        title: "頭部運動",
        titleCantonese: "頭部運動",
        shortText: "輕輕左右轉，放鬆頸關節",
        shortTextCantonese: "慢慢左右轉，放鬆條頸關節",
        fullTip: "請坐在穩固的椅子上，雙手自然放在膝蓋。慢慢將頭轉向左邊，停留3秒，再慢慢轉向右邊，停留3秒。重複動作，不要用力過猛、不要太快，感覺脖子兩側肌肉微微拉伸即可。如果有任何頭暈，請立刻停下來休息。",
        fullTipCantonese: "請坐喺張穩陣嘅椅上面，兩手自然放喺膝頭。慢慢將個頭轉去左邊，停三秒，再慢慢轉去右邊，停三秒。重複動作，唔好太用力、唔好轉得太快，感覺條頸兩邊肌肉有少少提拉就得。如果覺得有少少頭暈，就要即刻停落嚟休息。",
        voiceText: "頭部運動。請坐在穩固的椅子上，慢慢將頭轉向左邊，停留三秒，再慢慢轉向右邊，停留三秒。速度要慢，不要用力過猛。如果有頭暈，請立刻休息喔。",
        voiceTextCantonese: "頭部運動。請坐喺穩陣嘅椅上面，慢慢將個頭轉去左邊，停三秒，再慢慢轉去右邊，停三秒。速度要慢，唔好太用力。如果覺得頭暈，就要即刻休息啦。"
      },
      {
        id: "ex_arms",
        emoji: "🙌",
        title: "伸展手臂",
        titleCantonese: "伸展手臂",
        shortText: "雙臂向上伸，深呼吸抬頭",
        shortTextCantonese: "雙手舉高高，深呼吸放鬆膊頭",
        fullTip: "吸氣時，雙手手掌朝上慢慢舉高至頭頂上方（若肩膀酸痛，舉到舒適的高度即可），掌心相對。吐氣時，雙臂慢慢由身體兩側畫大圓放下，同時配合深呼吸。這樣可以活動雙肩，增加血液循環，放鬆胸部。",
        fullTipCantonese: "吸氣嗰陣，兩手手掌朝上慢慢舉高到頭頂上面（如果膊頭酸痛，舉到舒服嘅高度就得），兩掌相對。呼氣嗰陣，對手慢慢由身體兩側畫個大圈揞落嚟，同時配合深呼吸。咁樣可以活動下膊頭、改善血液循環、放鬆胸口。",
        voiceText: "伸展手臂。配合深呼吸，雙手慢慢向上舉過頭頂，再由身體兩側畫大圓慢慢放下。活動一下肩膀，感覺身體舒展開來。",
        voiceTextCantonese: "拉下手手腳腳。配合深呼吸，雙手慢慢向上舉過頭頂，再由身體兩側畫個大圈慢慢放低。活動下對膊頭，人會更放鬆。"
      },
      {
        id: "ex_waist",
        emoji: "💃",
        title: "腰部轉動",
        titleCantonese: "拧下條腰",
        shortText: "雙手扶椅背，慢慢轉轉腰",
        shortTextCantonese: "手扶好椅背，慢慢擰下條腰",
        fullTip: "坐在椅子上，身體坐正，雙腳平貼地面。雙手叉腰或輕扶大腿，以腹部為中心，輕輕地將上身向左後方旋轉，再慢慢轉回，接著向右後方旋轉。這能促進胃腸蠕動，改善腰部僵硬。",
        fullTipCantonese: "坐喺張椅上面，個人坐直，兩隻腳踏實地面。雙手叉腰或者輕輕扶住大腿，以肚為中心，輕輕將上身向左邊拧，再慢慢轉返嚟，之後再向右邊拧。咁樣可以幫到腸胃蠕動，舒緩條腰僵硬。",
        voiceText: "腰部轉動。坐正並踩穩地板，雙手扶好，慢慢把上身朝著左邊轉一轉，再朝著右邊轉一轉。速度慢一點，保持身體平衡。",
        voiceTextCantonese: "擰下條腰。坐直、兩隻腳踩實地板，雙手扶好，慢慢將上身向左邊擰一擰，再向右邊擰一擰。速度慢啲，保持平衡。"
      },
      {
        id: "ex_legs",
        emoji: "🦵",
        title: "活動雙腿",
        titleCantonese: "活動大腿",
        shortText: "坐在椅子上，雙腿踢一踢",
        shortTextCantonese: "坐喺張椅度，雙腳踢下伸下",
        fullTip: "坐在有靠背的穩固椅子上，雙手扶住椅子邊緣。一邊膝蓋慢慢伸直，腳尖朝上，將小腿抬平，停留3秒後放下，再換另一隻腳。此動作能鍛鍊大腿肌肉（股四頭肌），保護膝關節，走起路來更穩健！",
        fullTipCantonese: "坐喺有椅背嘅穩陣椅上面，雙手扶住椅邊。一邊膝頭慢慢伸直，腳面向上，將小腿抬平，停三秒後放低，再換另一隻腳。呢個動作可以鍛鍊大腿肌肉，保護膝關節，行路嗰陣自然更穩健！",
        voiceText: "活動雙腿.坐在穩固的椅子上，扶好扶手。把一隻腳往前踢平，腳尖朝上指，停留三秒再放下。接著換另一隻腳踢踢看。這能讓雙腿更有力氣喔。",
        voiceTextCantonese: "活動對腳。坐喺穩陣椅上面，雙手扶好椅邊。將一邊嘅腳向前慢慢踢直，腳尖向上指，停三秒再放低。然後再換另一隻腳踢。咁樣對腳會更加有力。"
      },
      {
        id: "ex_back",
        emoji: "🧍",
        title: "背部放鬆",
        titleCantonese: "舒緩背部",
        shortText: "身體向前傾，伸展背肌群",
        shortTextCantonese: "個人向前傾，拉下背脊肌",
        fullTip: "坐在椅子前緣（椅子要穩固），雙腳打開與肩同寬，踩實地面。雙手抱著對側肩膀，身體慢慢向前微微傾斜，低頭並讓背部微拱，感覺後背肌肉被拉開，停留5秒。這能有效紓解久坐產生的背部及脊椎痠痛。",
        fullTipCantonese: "坐喺椅前（張椅要穩陣），兩隻腳打開到同肩膊一樣闊，踩實個地。雙手交叉抱住對面膊頭，個人慢慢向前傾少少，耷低頭並讓背脊微拱，感覺到後背肌肉拉開，停五秒。呢個動作可以有效舒緩坐得耐嘅腰酸背痛。",
        voiceText: "背部放鬆。雙腳踩實地面，手抱著肩膀，身體稍微往前傾，低頭讓背部拱起來放鬆，感覺後背緊繃的肌肉得到了舒展。",
        voiceTextCantonese: "背部放鬆。兩隻腳踩實地板，雙手抱住膊頭，上身慢慢向前傾少少，低頭讓背部微拱放鬆，感覺後半身僵硬肌肉拉開，好舒服。"
      },
      {
        id: "ex_fingers",
        emoji: "👐",
        title: "手指操",
        titleCantonese: "靈活手指操",
        shortText: "張開再握拳，活動手指頭",
        shortTextCantonese: "撐開手再握拳，郁下手指頭",
        fullTip: "雙手在胸前伸直。雙手用力張開，十指盡量展開到最大，維持2秒；然後用力握緊拳頭，維持2秒。這樣一開一合為一次，連續做10次。這項運動能刺激末梢循環，保持手指靈活，還對大腦活化大有幫助！",
        fullTipCantonese: "對手喺胸前伸直。雙手用力展開，十隻手指盡量撐到最大，維持兩秒；然後用力握緊拳頭，維持兩秒。一開一合為之一組，連續做十次。呢個手指操可以刺激手指血液循環，令手指關節靈活，仲能幫手活化大腦！",
        voiceText: "手指操。把雙手伸出來。用力把手指頭張到最大，然後用力握緊拳頭。一開一合，連續多做幾次。活動手指頭對大腦非常好喔！",
        voiceTextCantonese: "手指操。伸對手出嚟，一齊用力將手指撐到最大，再用力揸緊拳頭。一開一合，重覆做幾次。活動下手指對大腦非常好㗎！"
      }
    ]
  },
  {
    id: "dining",
    name: "🍚 用餐提醒",
    nameCantonese: "🍚 食飯提醒",
    icon: "utensils",
    description: "細細品嚐每一口，吃得營養又安心",
    descriptionCantonese: "一啖一啖慢慢嚼，食得營養又放心",
    items: [
      {
        id: "di_ready",
        emoji: "🍽️",
        title: "準備吃飯啦",
        titleCantonese: "夠鐘食飯啦",
        shortText: "開飯時刻到，洗個手吃飯",
        shortTextCantonese: "開飯時刻到，洗乾淨手食飯",
        fullTip: "豐盛美味又营养的飯菜已經準備好了！在開飯前，請記得先用肥皂肥皂仔細搓洗雙手至少20秒。乾淨衛生的雙手是防範感冒與病毒侵襲最重要的一步，讓我們食得安心、身體健康！",
        fullTipCantonese: "香噴噴、精緻營養嘅飯菜準備就緒啦！食飯之前，記住先用番鹼洗清對手，搓手搓足至少二十秒。洗乾淨雙手能極好防範流感同病毒侵襲。一齊乾淨衛生食餐好！",
        voiceText: "準備吃飯啦！香噴噴、营养豐富的飯菜做好囉。吃飯前，請先用肥皂洗洗手，擦乾後再坐下來，愉快地享受這餐美食吧。",
        voiceTextCantonese: "夠鐘食飯啦。香噴噴、有營養嘅飯食準備好啦。開飯前，請先用番鹼好好洗手，抹乾手再坐落嚟，開開心心食飯。"
      },
      {
        id: "di_taste",
        emoji: "😋",
        title: "味道合口嗎",
        titleCantonese: "味道啱口味嘛",
        shortText: "菜冷熱剛好，味道好極了",
        shortTextCantonese: "菜熱辣辣，味道啱啱好",
        fullTip: "今天的菜色合您的口味嗎？是否會太鹹、太淡或太油？如果覺得不合胃口、或者是食物煮得不夠軟爛不方便咬，請隨時告訴家人或照護人員，我們很樂意為您客製化調整！為了您的胃口與健康，您的意見最重要！",
        fullTipCantonese: "今日嘅飯菜啱唔啱你口味呀？會唔會太鹹、太淡，或者太油膩？如果覺得唔夠合意，或者覺得啲嘢食煮得唔夠爛、比較難咬，隨時話畀家人或者照顧者聽。我哋好高興同你調整。你食得舒服最緊要！",
        voiceText: "味道合您的胃口嗎？如果覺得菜太鹹、太淡，或者是不夠軟不方便咬，一定要隨時跟我說，我們會為您調整得更好吃喔。",
        voiceTextCantonese: "味道啱唔啱你心水？如果覺得菜鹹得滯、太淡，或者唔夠腍好難咬，隨時話我聽，幫你整得更好食。"
      },
      {
        id: "di_slowly",
        emoji: "🥣",
        title: "小心慢慢吃",
        titleCantonese: "小心慢慢食",
        shortText: "夾菜不著急，小心別燙口",
        shortTextCantonese: "夾菜唔洗急，小心唔好燙口",
        fullTip: "熱湯和熱菜剛出爐時溫度很高，請一定要先吹一吹，不求快。一筷一筷慢慢夾，小口喝湯，特別是稀飯或湯麵，保證吞嚥安全，避免因著急而燙傷喉嚨或引起嗆咳。安全健康第一！",
        fullTipCantonese: "滾湯同熱餸熱辣辣啱啱出爐，熱度好高，食之前一定要吹吹佢，唔好求快。一筷子一筷子慢慢夾，一細口一細口飲湯。食粥或者食湯麵嗰陣，最緊要慢慢伊，唔好心急，好容易燙到人或者淥親喉嚨。",
        voiceText: "小心慢慢吃。熱湯與菜餚剛做好可能很燙，夾起來先吹一吹。一口一口慢慢送進嘴裡，順暢吞嚥，千萬不要著急喔。",
        voiceTextCantonese: "小心慢吞吞食。熱湯和餸菜啱啱做好好滾，夾起先吹兩下。一小口一小口慢慢吞下，千萬唔好著急。"
      },
      {
        id: "di_vege",
        emoji: "🥦",
        title: "多吃點蔬菜",
        titleCantonese: "食多啲蔬菜",
        shortText: "蔬菜高纖維，腸胃好順暢",
        shortTextCantonese: "菜菜多纖維，腸胃舒舒服服",
        fullTip: "多補充綠色蔬菜可以提供豐富的膳食纖維、維生素C及多種微量元素，不僅可以預防便祕、幫助排便、維持腸胃健康，更對控制血壓非常有益！今天餐盤中的菜菜，記得要多多夾來吃喔！",
        fullTipCantonese: "食多啲綠色蔬菜能提供滿滿膳食纖維、維他命同豐富營養，不單止可以改善便秘，幫助排便，對維持血壓平穩都好有益處！今日餐盤裏嘅菜菜，記住食多兩淡，健康滿滿！",
        voiceText: "多吃一點蔬菜。蔬菜含有滿滿的纖維和營養，能幫您排便順暢、保持血壓穩定。多吃綠色蔬菜，身體更有活力！",
        voiceTextCantonese: "食多啲青菜。蔬菜有好多豐富纖維同維他命，可以幫你排便順暢、血壓穩定。食多啖蔬菜，個人都更有力量。"
      },
      {
        id: "di_chew",
        emoji: "👄",
        title: "細嚼又慢嚥",
        titleCantonese: "細細口慢慢咬",
        shortText: "牙齒咬嚼好，腸道無負擔",
        shortTextCantonese: "牙齒咬嚼好，腸胃零負擔",
        fullTip: "每一口食物建議在嘴裡咀嚼至少15到20下。將食物嚼得越細碎，唾液揉合越充分，食物進入腸胃就越容易磨碎與吸收，能大大減少脹氣、腹痛等胃部不適，體會食物天然的鮮美滋味！",
        fullTipCantonese: "食嘢嗰陣，每一一小口最好喺口中慢慢嚼足十五至二十下。把食物咬得碎腐一啲，落去肚入面就最容易消化吸收，最能減少肚脹脹胃氣、肚痛唔舒服，仲最能體會到嘢食本身嘅清甜美味！",
        voiceText: "細嚼又慢嚥。吃東西的時候，記得多嚼幾下再吞進肚子裡。細嚼慢嚥能保護腸胃、好消化，還能吃出食物的甜美喔。",
        voiceTextCantonese: "細嚼慢嚥。食嘢嗰陣，記住慢慢咬多十幾下先吞。慢慢咬能保護你嘅腸胃，容易消化，仲能食出嘢食最鮮美嘅味道。"
      },
      {
        id: "di_full",
        emoji: "🤰",
        title: "吃飽了沒呀",
        titleCantonese: "食饱飽未呀",
        shortText: "八分飽正好，散散步消食",
        shortTextCantonese: "八成飽啱啱好，行出街散散步",
        fullTip: "您吃飽了嗎？感覺肚肚八分飽是最舒服、最沒有負擔的。吃飽了可以先喝幾口溫水，坐在椅子上和周圍人聊聊天，不要立刻躺到床上午睡，以免引起胃食道逆流。半小時後可以慢慢踱步散散步消食。",
        fullTipCantonese: "你飽飽未呀？食到八成飽係對身體同胃部最舒服、最冇負擔嘅。食飽之後，可以飲番落兩啖暖水，坐喺椅上和大家傾下偈，千祈唔好即刻去床度瞓低，咁樣容易引起胃酸倒流。等半個鐘後，慢慢行下散散步消消食。",
        voiceText: "您吃飽了嗎？如果吃飽了，先在位子上坐一下，休息一下，不要馬上躺下來喔。等會兒可以散散步消消食，對腸胃最好。",
        voiceTextCantonese: "你食飽飽未呀？如果飽啦，先喺座位上坐多陣，唔好即刻躺低睏。等陣間可以扶住房散下步消消食，對腸胃最健康。"
      }
    ]
  },
  {
    id: "health",
    name: "💊 吃藥與健康",
    nameCantonese: "💊 準時服藥",
    icon: "sparkles",
    description: "呵護身體每一步，生活規律精神足",
    descriptionCantonese: "錫住身子每一步，生活規律精神好",
    items: [
      {
        id: "he_medicine",
        emoji: "💊",
        title: "該吃藥了",
        titleCantonese: "夠鐘食藥啦",
        shortText: "配溫開水吃，按時服良藥",
        shortTextCantonese: "配暖水食藥，準時食藥身體好",
        fullTip: "吃藥時間到了！請對照藥袋上的叮囑，分清是飯前還是飯後服用。請搭配一整杯溫開水（至少200毫升）吞服，萬萬不可用冰水、茶或果汁配藥，以免影響藥效也加重胃部負擔喔。如果有不舒服請立刻反映。",
        fullTipCantonese: "夠鐘食藥啦！請睇清藥袋上面嘅叮嚀，分清係飯前食定飯後食。請配一整杯暖開水吞藥，記住唔好用冰水、茶水或者果汁吞，咁樣會影響藥力發揮，仲會傷胃。服完藥有咩唔舒服就要話我知。",
        voiceText: "時間到囉，該吃藥了。請核對一下藥袋，配一大杯溫開水服下。按時吃藥是維持健康、保證活力的關鍵喔。",
        voiceTextCantonese: "夠時辰啦，該食藥囉。請核對下藥袋，倒大杯暖水送藥。準時，按吩咐食藥係保持精神同健康的關鍵㗎。"
      },
      {
        id: "he_water",
        emoji: "🥛",
        title: "喝杯溫水",
        titleCantonese: "飲杯暖開水",
        shortText: "好水不離身，通暢代謝強",
        shortTextCantonese: "多飲杯暖水，身體排毒又舒服",
        fullTip: "水分是生命之源，特別是溫開水更溫和不刺激胃部。每次喝個兩三口，少量多次，能促進體內廢物排出，維持血液循環暢通，特別是清晨、兩餐之間，補足水分皮膚也更健康，人也更清爽！",
        fullTipCantonese: "水係有益健康嘅！特別係暖開水對腸胃最溫和。每次飲兩三啖，好水不離身。多飲暖水可以幫助體內排毒、順暢血液。尤其是朝早清晨起身，一定要飲番杯，成個人舒服晒！",
        voiceText: "喝杯熱乎乎的溫開水吧。多喝溫水可以補充身體水分、促進新陳代謝，也讓喉嚨和腸胃都暖暖的、更舒服。",
        voiceTextCantonese: "飮杯暖開水啦。多飮暖水可以補充你身體水份，令新陳代謝更好，喉嚨同胃部都暖烘烘、好舒服。"
      },
      {
        id: "he_bp",
        emoji: "💓",
        title: "量量血壓",
        titleCantonese: "記得量血壓",
        shortText: "定時量血壓，紀錄少擔憂",
        shortTextCantonese: "定時量好血壓，筆記寫低最精明",
        fullTip: "每天早晚可以在身體平靜、休息5分鐘後，使用血壓計進行測量。測量時手臂與心臟同高，背部靠著椅背，不說話。隨手把數值記錄在筆記本上，回診時可以讓醫生當作極佳的配藥參考，守護心血管健康！",
        fullTipCantonese: "每日早晚可以在身心放鬆、坐低休息大約五分鐘後，用血壓計測量一測。量血壓嗰陣，手臂與心臟一樣高，背脊放鬆靠住椅背，唔好講嘢。順著把數字記錄在薄仔上，去診所看醫生時最有用啦，保護你嘅心血管！",
        voiceText: "我們來量量血壓吧。請先安靜地坐好，休息五分鐘。套上血壓套後，不要說話，保持平心靜氣，量完記得記錄數值喔。",
        voiceTextCantonese: "我哋齊齊量下血壓。請先安靜坐低，放鬆休息五分鐘。套好血壓套後，唔好講嘢，保持心境平靜，量完記低數字去薄仔喔。"
      },
      {
        id: "he_breath",
        emoji: "🌬️",
        title: "深呼吸",
        titleCantonese: "配合深呼吸",
        shortText: "吸氣在鼻子，緩緩吐出氣",
        shortTextCantonese: "用鼻吸嘴吐，心情舒暢人安定",
        fullTip: "請放鬆雙肩。用鼻子慢慢吸氣，感覺腹部慢慢鼓起來（維持4秒），然後再用嘴巴像吹蠟燭一樣，緩緩、長長地把氣吐乾淨（維持6秒）。這樣深呼吸3到5次，能迅速降低心跳速率，沉澱緊繃情緒，消除焦慮。",
        fullTipCantonese: "一齊放鬆對膊頭。用個鼻慢慢吸氣進去，感覺個肚脹起（吸大約四秒），然後用個嘴像吹蠟燭咁樣，慢慢、長長地吐氣（呼大約六秒）。做呢個深呼吸三到五次，可以令心跳安靜落嚟、身心放鬆。",
        voiceText: "深呼吸。請先放鬆肩膀。跟著我：鼻子吸氣……一、二、三、四；嘴巴慢慢吐氣……一、二、三、四、五、六。重複做幾次，讓心情平靜下。",
        voiceTextCantonese: "吸口氣，呼口氣。放鬆下膊頭，跟著我一齊：鼻慢慢吸氣：一、二、三、四；口吐出長長氣：一、二、三、四、五、六。重複做幾次，心情會平靜好多。"
      },
      {
        id: "he_rest",
        emoji: "🛀",
        title: "早點休息",
        titleCantonese: "早啲去休息",
        shortText: "舒緩洗熱浴，夜晚安神定",
        shortTextCantonese: "熱水浸腳放鬆，舒緩整天疲勞",
        fullTip: "今天活動得很豐富，身體可能有點累了。洗個溫暖的熱水澡，或者用溫熱水泡泡腳，能極大放鬆緊繃的小腿與足部肌肉，舒緩一整天的疲勞。調暗房間的光線，準備讓大腦進入休眠模式。",
        fullTipCantonese: "今日你活動得非常豐富，身骨都有啲攰啦。洗個溫水澡、或者倒盆暖水浸下腳，對舒緩小腿僵硬最有用，可以舒緩全日疲倦。睏覺前調暗房嘅燈光，等大腦安安靜靜準備進入睡眠。",
        voiceText: "今天辛苦了，早點休息吧。可以泡個溫水腳，活動活動，放鬆僵硬的肌肉，靜心讓大腦好好放鬆，準備睡個好覺吧。",
        voiceTextCantonese: "今日辛苦你啦，早點上床休息。可以用熱水泡泡腳，舒解你全身疲勞，放鬆條筋骨。準備舒暢睏個好覺。"
      },
      {
        id: "he_sleep",
        emoji: "🛏️",
        title: "按時睡覺",
        titleCantonese: "夠鐘去睏覺啦",
        shortText: "床被溫暖多，祝您好夢回",
        shortTextCantonese: "床墊軟綿綿，祝你今晚有個美夢",
        fullTip: "維持規律的作息，是擁有強健免疫力的不二法門。請於每天固定的時間睡覺，避免在床上滑手機、看強光。維持房間舒適的溫度與安靜，祝福您擁有充沛好眠，明天元氣滿滿地起床！",
        fullTipCantonese: "每日準時睏覺，建立規律生活，係令身體保持強健身心和免疫力嘅好方法！上咗床就唔好玩電話或者睇強光。搞好被褥，保持間房溫暖安靜，祝你今晚做個甜甜嘅好夢，明朝精神滿滿起床！",
        voiceText: "晚安，時候不早了，按時睡覺對身體最好。整理一下床鋪，蓋好被子，祝您今晚做個香甜的美夢，明天見！",
        voiceTextCantonese: "晚安，夜拉，夠鐘睏啦。蓋實好被子，祝今晚有個香軟嘅美夢。我哋明朝見囉！"
      }
    ]
  },
  {
    id: "cooking",
    name: "🍳 蒸炒炆焗",
    nameCantonese: "🍳 蒸炒炆焗",
    icon: "utensils",
    description: "為長輩準備的低鈉少油精選食譜，美味健康",
    descriptionCantonese: "為長輩特製嘅少油低鹽抗三高家常食譜，好嚼好吞",
    items: []
  }
];

export function getBestVoice(voices: SpeechSynthesisVoice[], lang: "zh-HK" | "zh-TW"): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  // Normalize/clean helper for locale code comparisons
  const clean = (str: string) => str.toLowerCase().replace(/_/g, "-");

  if (lang === "zh-HK") {
    // Cantonese matching
    // 1. Strict language code check
    const match1 = voices.find(v => {
      const l = clean(v.lang);
      return l === "zh-hk" || l === "zh-yue-hk" || l === "yue-hk";
    });
    if (match1) return match1;

    // 2. Substrings in language code or name (e.g., zh-hk, yue, cantonese)
    const match2 = voices.find(v => {
      const l = clean(v.lang);
      const n = v.name.toLowerCase();
      return l.includes("zh-hk") || l.includes("yue") || n.includes("cantonese") || n.includes("sinji") || n.includes("sin-ji") || n.includes("hong kong");
    });
    if (match2) return match2;
    
    // 3. Fallback search: any voice containing "hk" or "yue"
    const match3 = voices.find(v => {
      const l = clean(v.lang);
      const n = v.name.toLowerCase();
      return l.includes("hk") || l.includes("yue") || n.includes("cantonese");
    });
    if (match3) return match3;
  } else {
    // Mandarin matching
    // 1. Taiwan Mandarin strict match
    const matchTW1 = voices.find(v => {
      const l = clean(v.lang);
      return l === "zh-tw" || l === "zh-hant-tw" || l === "cmn-tw";
    });
    if (matchTW1) return matchTW1;

    // 2. Substrings in name/lang for Taiwan Mandarin
    const matchTW2 = voices.find(v => {
      const l = clean(v.lang);
      const n = v.name.toLowerCase();
      return l.includes("zh-tw") || l.includes("hant-tw") || n.includes("taiwan") || n.includes("meijia") || n.includes("mei-jia");
    });
    if (matchTW2) return matchTW2;

    // 3. Fallback to Mainland Mandarin (which is Mandarin/Putonghua, much closer and clear to understand than Cantonese)
    const matchCN1 = voices.find(v => {
      const l = clean(v.lang);
      return l === "zh-cn" || l === "zh-hans-cn" || l === "cmn-cn";
    });
    if (matchCN1) return matchCN1;

    const matchCN2 = voices.find(v => {
      const l = clean(v.lang);
      const n = v.name.toLowerCase();
      return l.includes("zh-cn") || l.includes("hans-cn") || l.includes("zh-hans") || n.includes("tingting") || n.includes("mainland") || n.includes("liaoliao");
    });
    if (matchCN2) return matchCN2;

    // 4. Fallback search: any voice containing "tw", "cn", "cmn", "mandarin", or "putonghua"
    const matchCN3 = voices.find(v => {
      const l = clean(v.lang);
      const n = v.name.toLowerCase();
      return l.includes("tw") || l.includes("cn") || l.includes("cmn") || n.includes("mandarin") || n.includes("putonghua") || n.includes("siri");
    });
    if (matchCN3) return matchCN3;
  }

  // Final fallback: any Chinese voice whatsoever
  const anyZhMatched = voices.find(v => {
    const l = clean(v.lang);
    return l.startsWith("zh") || l.includes("yue");
  });
  if (anyZhMatched) return anyZhMatched;

  // Ultimate fallback: first available voice
  return voices[0] || null;
}
