import React, { useState } from 'react';
import { 
  Building2, RefreshCw, Filter, X, TrendingUp, DollarSign, ChevronRight, Building, Download, Calendar
} from 'lucide-react';

// 수도권(서울, 경기, 인천) 전역 법정동 코드
const REGION_OPTIONS = [
  // ================= 서울특별시 =================
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

  // ================= 경기도 =================
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

  // ================= 인천광역시 =================
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
  const [selectedRegion, setSelectedRegion] = useState('11320'); // 서울 도봉구
  const [propertyType, setPropertyType] = useState('apt');
  const [selectedYear, setSelectedYear] = useState('2024'); // 데이터가 안정적인 2024년 기본값
  const [maxRatio, setMaxRatio] = useState(85);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('조건 설정 후 [연간 매물 탐색] 버튼을 누르세요.');
  const [realTrades, setRealTrades] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // 선택한 년도(selectedYear)의 1월~12월 데이터를 실제로 각각 연동하여 수집하는 함수
  const handleFetchData = async () => {
    setLoading(true);
    setStatusMessage(`${selectedYear}년도 1월~12월 전체 월별 국토부 실거래 데이터 수집 중...`);

    const tradeEndpoint = propertyType === 'apt' ? '/api/apt-trades' : '/api/villa-trades';
    const backendUrl = 'https://propvalue-backend.onrender.com';

    try {
      // 1. 해당 연도의 1~12월 12개 월별 YYYYMM 배열 생성 (예: 202401 ~ 202412)
      const months = Array.from({ length: 12 }, (_, i) => `${selectedYear}${String(i + 1).padStart(2, '0')}`);
      
      // 2. 12개 월별 실거래 API 요청 및 CODEF 모의 경매 API 동시 호출
      const tradePromises = months.map(ymd => 
        fetch(`${backendUrl}${tradeEndpoint}?lawdCd=${selectedRegion}&dealYmd=${ymd}`)
          .then(res => res.json())
          .catch(() => ({ success: false, data: [] }))
      );

      const [auctionRes, ...tradeResults] = await Promise.all([
        fetch(`${backendUrl}/api/codef-auction-mock?regionCode=${selectedRegion}&buildingType=${propertyType}`).then(res => res.json()),
        ...tradePromises
      ]);

      // 3. 1~12월 수집 데이터 하나로 합치기
      let allYearTrades = [];
      tradeResults.forEach(res => {
        if (res.success && res.data) {
          const items = Array.isArray(res.data) ? res.data : [res.data];
          allYearTrades = [...allYearTrades, ...items];
        }
      });

      const mockAuctionList = auctionRes.data || [];

      // 4. 국토부 실제 단지명 필드 추출 가공 (가상 대체명 없음)
      const formattedData = allYearTrades.map((item, idx) => {
        const rawPrice = parseInt((item.dealAmount || '0').replace(/,/g, '').trim(), 10) * 10000;
        
        // 국토부 실제 단지명 추출 (아파트: aptNm, 빌라/다세대: mrhousNm)
        const realName = item.aptNm || item.mrhousNm || item.단지명 || (propertyType === 'apt' ? '아파트' : '빌라/다세대');

        const matchedAuction = mockAuctionList[idx % Math.max(1, mockAuctionList.length)];
        const caseNo = matchedAuction ? matchedAuction.resCaseNo : `2024타경${3000 + idx}`;

        const mockRatio = 0.68 + (idx % 15) * 0.01;
        const auctionPrice = matchedAuction?.resMinLowerPrice 
          ? matchedAuction.resMinLowerPrice 
          : Math.round(rawPrice * mockRatio);

        const ratioPercent = Math.round((auctionPrice / rawPrice) * 100);
        const profit = rawPrice - auctionPrice;

        const dealMonth = String(item.dealMonth || '01').padStart(2, '0');
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
      setStatusMessage(`${selectedYear}년도 실제 실거래 매물 총 ${formattedData.length}건 수집 완료`);
    } catch (error) {
      console.error(error);
      setStatusMessage('백엔드 서버 통신 에러! (Render 서버 가동 대기 중)');
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
              <span className="bg-blue-950 text-blue-400 border border-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                수도권 경매&실거래 추적기 2.5
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">서울 · 경기 · 인천 CODEF 대법원 경매 및 연간 실거래가 탐색</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#111827] p-4 rounded-xl border border-slate-800 flex justify-between items-center">
          <div>
            <p className="text-slate-400 text-xs font-medium">포착된 실거래 매물</p>
            <p className="text-2xl font-black text-sky-400 mt-1">{totalCount} <span className="text-sm font-normal text-slate-400">건</span></p>
          </div>
          <Building className="w-7 h-7 text-sky-400 opacity-80" />
        </div>

        <div className="bg-[#111827] p-4 rounded-xl border border-slate-800 flex justify-between items-center">
          <div>
            <p className="text-slate-400 text-xs font-medium">평균 실거래 대비 낙찰가율</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{avgRatio}%</p>
          </div>
          <TrendingUp className="w-7 h-7 text-emerald-400 opacity-80" />
        </div>

        <div className="bg-[#111827] p-4 rounded-xl border border-slate-800 flex justify-between items-center">
          <div>
            <p className="text-slate-400 text-xs font-medium">평균 예상 시세 차익</p>
            <p className="text-2xl font-black text-pink-400 mt-1">+{avgProfit}억원</p>
          </div>
          <DollarSign className="w-7 h-7 text-pink-400 opacity-80" />
        </div>
      </div>

      <div className="bg-[#111827] p-5 rounded-2xl border border-slate-800 mb-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-amber-400" />
          <h2 className="text-xs font-bold text-slate-200 uppercase">수도권 지역 및 년도별 검색 조건</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">1. 매물 종류</label>
            <div className="grid grid-cols-2 gap-1 bg-[#090d16] p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setPropertyType('apt')}
                className={`py-2 text-xs font-bold rounded-lg transition ${propertyType === 'apt' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                🏢 아파트
              </button>
              <button
                type="button"
                onClick={() => setPropertyType('villa')}
                className={`py-2 text-xs font-bold rounded-lg transition ${propertyType === 'villa' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
              >
                🏡 빌라/다세대
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">2. 수도권 지역 선택</label>
            <select 
              value={selectedRegion} 
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-[#090d16] border border-slate-700/80 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500"
            >
              {REGION_OPTIONS.map((reg) => (
                <option key={reg.code} value={reg.code}>{reg.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              3. 조회 년도 선택
            </label>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-[#090d16] border border-slate-700/80 text-blue-400 font-bold rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500"
            >
              {YEAR_OPTIONS.map((yr) => (
                <option key={yr} value={yr}>{yr}년 전체</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
              <span>4. 낙찰가율 조건</span>
              <span className="text-blue-400 font-bold">{maxRatio}% 이하</span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="95" 
              value={maxRatio} 
              onChange={(e) => setMaxRatio(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <button 
            onClick={handleFetchData} 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/20"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            연간 매물 탐색
          </button>
        </div>

        <div className="mt-3 text-xs text-blue-400 font-medium">
          상태: {statusMessage}
        </div>
      </div>

      <div className="bg-[#111827] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex flex-wrap justify-between items-center gap-3">
          <h3 className="text-sm font-bold text-slate-200">
            📋 {selectedYear}년도 실거래 매물 목록 ({filteredData.length}건)
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:inline">행 클릭 시 상세 모달 보기</span>
            <button
              onClick={handleExportCSV}
              disabled={filteredData.length === 0}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition shadow-md shadow-emerald-600/20"
            >
              <Download className="w-3.5 h-3.5" />
              엑셀(CSV) 다운로드
            </button>
          </div>
        </div>

        {filteredData.length > 0 ? (
          <div className="divide-y divide-slate-800/60 overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-xs text-slate-300 min-w-[750px]">
              <thead className="bg-[#090d16] text-slate-400 font-semibold uppercase border-b border-slate-800 sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-4">사건번호 (CODEF)</th>
                  <th className="py-3 px-4 text-center">거래 연월</th>
                  <th className="py-3 px-4">매물명 및 층수</th>
                  <th className="py-3 px-4">전용면적</th>
                  <th className="py-3 px-4 text-right">추정 낙찰가</th>
                  <th className="py-3 px-4 text-right">최근 실거래가</th>
                  <th className="py-3 px-4 text-center">실거래 대비 비율</th>
                  <th className="py-3 px-4 text-center">상세보기</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredData.map((item) => (
                  <tr 
                    key={item.id} 
                    onClick={() => setSelectedItem(item)}
                    className="hover:bg-slate-800/50 cursor-pointer transition"
                  >
                    <td className="py-3.5 px-4 font-bold text-amber-400">{item.caseNo}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-sky-400 bg-slate-900/40 rounded-md">
                      {item.dealMonthDisplay}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {item.name}
                      <span className="block text-[11px] text-slate-500 font-normal">{item.address}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{item.area}㎡</td>
                    <td className="py-3.5 px-4 text-right font-bold text-amber-300">
                      {(item.auctionPrice / 100000000).toFixed(2)}억원
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-400">
                      {(item.dealPrice / 100000000).toFixed(2)}억원
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="bg-blue-950 text-blue-400 border border-blue-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                        {item.ratio}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-500">
                      <ChevronRight className="w-4 h-4 mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <Building2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 text-sm font-semibold">조건에 일치하는 매물 데이터가 없습니다.</p>
          </div>
        )}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-950 text-amber-400 border border-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                📌 CODEF 사건번호: {selectedItem.caseNo}
              </span>
              <span className="bg-sky-950 text-sky-400 border border-sky-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                📅 거래월: {selectedItem.dealMonthDisplay}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-0.5">{selectedItem.name}</h3>
            <p className="text-xs text-slate-400 mb-5">{selectedItem.address} · 전용면적 {selectedItem.area}㎡</p>

            <div className="bg-[#090d16] p-4 rounded-xl border border-slate-800 space-y-2.5 mb-5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">⚡ 경매 추정 낙찰가</span>
                <span className="font-bold text-amber-400 text-sm">{(selectedItem.auctionPrice / 100000000).toFixed(2)}억원</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">🏢 최근 실거래가 ({selectedItem.dealDate})</span>
                <span className="font-bold text-emerald-400 text-sm">{(selectedItem.dealPrice / 100000000).toFixed(2)}억원</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-800/80 pt-2">
                <span className="text-slate-400">📈 KB 시세 추정가</span>
                <span className="font-bold text-sky-400">{(selectedItem.kbPrice / 100000000).toFixed(2)}억원</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">🏛️ 공시가격 추정가</span>
                <span className="font-bold text-slate-300">{(selectedItem.officialPrice / 100000000).toFixed(2)}억원</span>
              </div>
            </div>

            <div className="bg-blue-950/50 border border-blue-800/60 p-4 rounded-xl flex justify-between items-center mb-5">
              <div>
                <p className="text-[11px] text-blue-300">낙찰 시점 시세 차익</p>
                <p className="text-xl font-black text-blue-400">+{(selectedItem.profit / 100000000).toFixed(2)}억원</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-blue-300">수익률 (실거래가 대비)</p>
                <p className="text-lg font-bold text-emerald-400">+{selectedItem.profitRate}%</p>
              </div>
            </div>

            <button 
              onClick={() => setSelectedItem(null)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;