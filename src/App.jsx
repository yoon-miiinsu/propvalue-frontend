import React, { useState } from 'react';
import { 
  Building2, RefreshCw, Filter, X, TrendingUp, DollarSign, ChevronRight, Building, Download, Calendar
} from 'lucide-react';

const REGION_OPTIONS = [
  // 서울특별시
  { code: '11680', label: '서울 강남구' },
  { code: '11740', label: '서울 강동구' },
  { code: '11305', label: '서울 강북구' },
  { code: '11500', label: '서울 강서구' },
  { code: '11620', label: '서울 관악구' },
  { code: '11215', label: '서울 광진구' },
  { code: '11530', label: '서울 구로구' },
  { code: '11545', label: '서울 금천구' },
  { code: '11350', label: '서울 노원구' },
  { code: '11320', label: '서울 도봉구' },
  { code: '11230', label: '서울 동대문구' },
  { code: '11590', label: '서울 동작구' },
  { code: '11440', label: '서울 마포구' },
  { code: '11410', label: '서울 서대문구' },
  { code: '11650', label: '서울 서초구' },
  { code: '11200', label: '서울 성동구' },
  { code: '11290', label: '서울 성북구' },
  { code: '11710', label: '서울 송파구' },
  { code: '11470', label: '서울 양천구' },
  { code: '11560', label: '서울 영등포구' },
  { code: '11170', label: '서울 용산구' },
  { code: '11380', label: '서울 은평구' },
  { code: '11110', label: '서울 종로구' },
  { code: '11140', label: '서울 중구' },
  { code: '11260', label: '서울 중랑구' },

  // 경기도
  { code: '41111', label: '경기 수원시 장안구' },
  { code: '41113', label: '경기 수원시 권선구' },
  { code: '41115', label: '경기 수원시 팔달구' },
  { code: '41117', label: '경기 수원시 영통구' },
  { code: '41131', label: '경기 성남시 수정구' },
  { code: '41133', label: '경기 성남시 중원구' },
  { code: '41135', label: '경기 성남시 분당구' },
  { code: '41150', label: '경기 의정부시' },
  { code: '41171', label: '경기 안양시 동안구' },
  { code: '41173', label: '경기 안양시 만안구' },
  { code: '41190', label: '경기 부천시' },
  { code: '41210', label: '경기 광명시' },
  { code: '41220', label: '경기 평택시' },
  { code: '41250', label: '경기 동두천시' },
  { code: '41271', label: '경기 안산시 상록구' },
  { code: '41273', label: '경기 안산시 단원구' },
  { code: '41281', label: '경기 고양시 덕양구' },
  { code: '41285', label: '경기 고양시 일산동구' },
  { code: '41287', label: '경기 고양시 일산서구' },
  { code: '41290', label: '경기 과천시' },
  { code: '41310', label: '경기 구리시' },
  { code: '41360', label: '경기 남양주시' },
  { code: '41370', label: '경기 오산시' },
  { code: '41390', label: '경기 시흥시' },
  { code: '41410', label: '경기 군포시' },
  { code: '41430', label: '경기 의왕시' },
  { code: '41450', label: '경기 하남시' },
  { code: '41461', label: '경기 용인시 처인구' },
  { code: '41463', label: '경기 용인시 기흥구' },
  { code: '41465', label: '경기 용인시 수지구' },
  { code: '41480', label: '경기 파주시' },
  { code: '41500', label: '경기 이천시' },
  { code: '41550', label: '경기 안성시' },
  { code: '41570', label: '경기 김포시' },
  { code: '41590', label: '경기 화성시' },
  { code: '41610', label: '경기 광주시' },
  { code: '41630', label: '경기 양주시' },
  { code: '41650', label: '경기 포천시' },
  { code: '41670', label: '경기 여주시' },
  { code: '41800', label: '경기 연천군' },
  { code: '41820', label: '경기 가평군' },
  { code: '41830', label: '경기 양평군' },

  // 인천광역시
  { code: '28110', label: '인천 중구' },
  { code: '28140', label: '인천 동구' },
  { code: '28177', label: '인천 미추홀구' },
  { code: '28185', label: '인천 연수구 (송도)' },
  { code: '28200', label: '인천 남동구' },
  { code: '28237', label: '인천 부평구' },
  { code: '28245', label: '인천 계양구' },
  { code: '28260', label: '인천 서구 (청라/검단)' },
  { code: '28710', label: '인천 강화군' },
  { code: '28720', label: '인천 옹진군' },
];

const YEAR_OPTIONS = ['2026', '2025', '2024', '2023', '2022'];

function App() {
  const [selectedRegion, setSelectedRegion] = useState('11320');
  const [propertyType, setPropertyType] = useState('apt');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [maxRatio, setMaxRatio] = useState(85);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('조건 설정 후 [연간 매물 탐색] 버튼을 누르세요.');
  const [realTrades, setRealTrades] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // API 호출 트래픽 초과를 막고 안정적으로 불러오는 함수
  const handleFetchData = async () => {
    setLoading(true);
    setStatusMessage(`${selectedYear}년도 경매 및 실거래 데이터 안전 조회 중...`);

    const tradeEndpoint = propertyType === 'apt' ? '/api/apt-trades' : '/api/villa-trades';
    const backendUrl = 'https://propvalue-backend.onrender.com';

    try {
      // 과부하 방지를 위해 03월, 06월, 09월, 11월 분기별 대표 데이터 4개만 안정적으로 동시 수집
      const targetYmds = ['03', '06', '09', '11'].map(m => `${selectedYear}${m}`);

      const [auctionRes, ...tradeResults] = await Promise.all([
        fetch(`${backendUrl}/api/codef-auction-mock?regionCode=${selectedRegion}&buildingType=${propertyType}`).then(res => res.json()),
        ...targetYmds.map(ymd => 
          fetch(`${backendUrl}${tradeEndpoint}?lawdCd=${selectedRegion}&dealYmd=${ymd}`)
            .then(res => res.json())
            .catch(() => ({ success: false, data: [] }))
        )
      ]);

      let allTrades = [];
      tradeResults.forEach(res => {
        if (res.success && res.data) {
          const items = Array.isArray(res.data) ? res.data : [res.data];
          allTrades = [...allTrades, ...items];
        }
      });

      const mockAuctionList = auctionRes.data || [];

      const formattedData = allTrades.map((item, idx) => {
        const rawPrice = parseInt((item.dealAmount || '0').replace(/,/g, '').trim(), 10) * 10000;
        const realName = item.aptNm || item.mrhousNm || item.단지명 || (propertyType === 'apt' ? '아파트' : '빌라/다세대');

        const matchedAuction = mockAuctionList[idx % Math.max(1, mockAuctionList.length)];
        const caseNo = matchedAuction ? matchedAuction.resCaseNo : `2024타경${3000 + idx}`;

        const mockRatio = 0.68 + (idx % 15) * 0.01;
        const auctionPrice = matchedAuction?.resMinLowerPrice 
          ? matchedAuction.resMinLowerPrice 
          : Math.round(rawPrice * mockRatio);

        const ratioPercent = Math.round((auctionPrice / rawPrice) * 100);
        const profit = rawPrice - auctionPrice;

        const dealMonth = String(item.dealMonth || ((idx % 12) + 1)).padStart(2, '0');
        const dealDay = String(item.dealDay || '15').padStart(2, '0');
        const dealYear = item.dealYear || selectedYear;

        return {
          id: `trade-${idx}`,
          caseNo: caseNo,
          name: `${realName} ${item.floor || 3}층`,
          type: propertyType === 'apt' ? '아파트' : '빌라/다세대',
          address: `${item.umdNm || item.legalDong || ''} ${item.jibun || ''}`,
          area: parseFloat(item.excluUseAr || item.mdfyExcluUseAr || 84.9),
          dealPrice: rawPrice,
          auctionPrice: auctionPrice,
          ratio: ratioPercent,
          profit: profit,
          profitRate: Math.round((profit / auctionPrice) * 100),
          kbPrice: Math.round(rawPrice * 1.02),
          officialPrice: Math.round(rawPrice * 0.68),
          dealMonthDisplay: `${dealMonth}월`,
          dealDate: `${dealYear}.${dealMonth}.${dealDay}`
        };
      });

      setRealTrades(formattedData);
      setStatusMessage(`${selectedYear}년도 실제 실거래 매물 총 ${formattedData.length}건 정상 수집 완료`);
    } catch (error) {
      console.error(error);
      setStatusMessage('백엔드 통신 대기 중... 5초 뒤 다시 눌러주세요.');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = realTrades.filter(item => item.ratio <= maxRatio);

  const totalCount = filteredData.length;
  const avgRatio = totalCount > 0 ? (filteredData.reduce((acc, cur) => acc + cur.ratio, 0) / totalCount).toFixed(1) : '0';
  const avgProfit = totalCount > 0 ? (filteredData.reduce((acc, cur) => acc + cur.profit, 0) / totalCount / 100000000).toFixed(2) : '0';

  const handleExportCSV = () => {
    if (filteredData.length === 0) {
      alert('다운로드할 데이터가 없습니다.');
      return;
    }

    const headers = [
      '사건번호(CODEF)', '구분', '거래연월', '매물명 및 층수', '소재지', '전용면적(㎡)', 
      '최근실거래가(원)', '추정낙찰가(원)', '실거래대비비율(%)', 'KB시세추정가(원)', 
      '공시가격추정가(원)', '예상시세차익(원)', '거래일자'
    ];

    const rows = filteredData.map(item => [
      item.caseNo,
      item.type,
      item.dealMonthDisplay,
      `"${item.name}"`,
      `"${item.address}"`,
      item.area,
      item.dealPrice,
      item.auctionPrice,
      item.ratio,
      item.kbPrice,
      item.officialPrice,
      item.profit,
      item.dealDate
    ]);

    let csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const regLabel = REGION_OPTIONS.find(r => r.code === selectedRegion)?.label || '수도권';
    link.href = url;
    link.setAttribute('download', `PropValue_경매실거래추적_${regLabel}_${selectedYear}년.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 p-4 md:p-8 font-sans">
      <header className="mb-6 pb-4 border-b border-slate-800 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-600/30">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">PropValue</h1>
              <span className="bg-blue-