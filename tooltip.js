const webtoonTooltips = {
        // 1
        "wjswlwjrehrwktlwja": " 전지적 독자 시점 | UMI / 슬리퍼-C ",
        "skghswkaksfpqpfdjq": " 나 혼자만 레벨업 | 현군 / 장성락 / 추공 ",
        "wksqnfdmlrltk": " 잔불의 기사 | 환댕 ",
        "dlwlrfhrm": " 이직로그 | 우시목 / 이하안 ",
        "angksdmlakqjqtk": " 무한의 마법사 | Kiraz / 아디티 / 김치우 ",
        "aksfpqvmffpdldjdml100qjsWoghlrnl": " 만렙 플레이어의 100번째 회귀 | Kiraz / 아디티 / 김치우 ",
        "thtjfthrdprtmxmfk": " 소설 속 엑스트라 | CarrotStudio / 지갑송 ",
        "tlqdlwlthsu": " 십이지소녀 | MAJOR / 지지 ",
        "dlsrkstjstodsla": " 인간 선생님 | 기령 ",
        "ghlrnlwktkdydtjfaudtj": " 회귀자 사용 설명서 | 도미 / Midnoght Studio / 흙수저 ",
        "vlraldjq!": " 픽 미 업! | 조우네 / 와삭바삭 ",
        // 2
        "ehddkfl": " 동아리 | 슈리넬 / QRQ ",
        "slduclsWjfejfk": " 니 여친 쩔더라 | 냉무19 / 빠니 ",
        "ekaqovlwlaktpdy!": " 담배피지 마세요! | 싸능 / 모모세 ",
        "wndnjTekTmfprlwkddptjwlfhlrPthsufmf": " 주웠다, 쓰레기장에서 지뢰계 소녀를 | 퐁당이 / 란몽 ",
        "skawkrkgmlrnlgka": " 남자가 희귀함 | 말포이 ",
        "gksurodtod": " 하녀갱생 | 은싸 / 우엉 ",
        "ejswjsthrtkwjd": " 던전 속 사정 | 레바 ",
        "whzktpdytkachs": " 조카세요 삼촌 | 수화 / G유 ",
        "rmrjrmfjgrpgksmsrjdkslsep": " 그거 그렇게 하는거 아닌데 | 양총 / 돌연사빅파이 ",
        "skawkrkdjqtsmsdltprP": " 남자가 없는 이세계 | 희민 ",
        // 3
        "cjswoaksudmlakfurrhrkf": " 천재마녀의 마력고갈 | 츠지시마 모토 ",
        "slduclsWjfejfk": " 니 여친 쩔더라 | 냉무19 / 빠니 ",
        "ekaqovlwlaktpdy!": " 담배피지 마세요! | 싸능 / 모모세 ",
        "wndnjTekTmfprlwkddptjwlfhlrPthsufmf": " 주웠다, 쓰레기장에서 지뢰계 소녀를 | 퐁당이 / 란몽 ",
        "skawkrkgmlrnlgka": " 남자가 희귀함 | 말포이 ",
        "gksurodtod": " 하녀갱생 | 은싸 / 우엉 ",
        "ejswjsthrtkwjd": " 던전 속 사정 | 레바 ",
        "whzktpdytkachs": " 조카세요 삼촌 | 수화 / G유 ",
        "rmrjrmfjgrpgksmsrjdkslsep": " 그거 그렇게 하는거 아닌데 | 양총 / 돌연사빅파이 ",
        "skawkrkdjqtsmsdltprP": " 남자가 없는 이세계 | 희민 ",
      };

      document.querySelectorAll('.general-webtoon-content').forEach(el => {
        const id = el.dataset.generalWebtoonId;
        if (webtoonTooltips[id]) {
          el.title = webtoonTooltips[id];
        } else {
          el.title = "웹툰 정보 없음";
        }
      });