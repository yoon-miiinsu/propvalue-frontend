import React, { useState } from 'react';
import { 
  Building2, Search, RefreshCw, Filter, Plus, X, BarChart3, TrendingUp, DollarSign, Calendar, Clock
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('auction'); 
  const [selectedRegion, setSelectedRegion] = useState('41135'); // 성남시 분당구
  const [dealYmd, setDealYmd] = useState('202503');
  const [discountRate, setDiscountRate] = useState(80);
  const [propertyType, setPropertyType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('지역과 연월 선택 후 [국토부 데이터 연동 호출]을 클릭하세요.');
  const [realTrades, setRealTrades] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // 국토부 API 데이터 연동 및 매칭
  const handleFetchData = async () => {
    setLoading(true);
    setStatusMessage('국토교통부 API 데이터 수신 중...');
    try {
      const response = await fetch(`https://propvalue-backend.onrender.com/api/apt-trades?lawdCd=${selectedRegion}&dealYmd=${dealYmd}`);
      const result = await response.json();

      if (result.success && result.data) {
        const formattedData = result.data.map((item, idx) => {
          const rawPrice = parseInt((item.dealAmount || '0').replace(/,/g, '').trim(), 10) * 10000;
          const mockRatio = 0.65 + (idx % 18) * 0.01; 
          const auctionPrice = Math.round(rawPrice * mockRatio);
          const ratioPercent = Math.round((auctionPrice / rawPrice) * 100);
          const profit = rawPrice - auctionPrice;

          return {
            id: `trade-${idx}`,
            caseNo: `2024타경${1020 + idx}`,
            name: `${item.aptNm || item.단지명 || '아파트'} ${item.floor || 10}층`,
            type: 'apt',
            address: `${item.umdNm || ''} ${item.jibun || ''}`,
            area: parseFloat(item.excluUseAr || 84.9),
            dealPrice: rawPrice,
            auctionPrice: auctionPrice,
            ratio: ratioPercent,
            profit: profit,
            profitRate: Math.round((profit / auctionPrice) * 100),
            auctionDate: '2024.10.15',
            dealDate: `${item.dealYear}.${String(item.dealMonth).padStart(2, '0')}.${String(item.dealDay).padStart(2, '0')}`,
            monthsToSell: 3 + (idx % 5)
          };
        });

        setRealTrades(formattedData);
        setStatusMessage(`총 ${formattedData.length}건의 국토부 실거래 분석 완료`);
      } else {
        setStatusMessage('데이터를 가져오지 못했습니다: ' + (result.message || result.error));
      }
    } catch (error) {
      console.error(error);
      setStatusMessage('백엔드 서버 통신 에러! 서버 상태를 확인하세요.');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = realTrades.filter(item => {
    if (propertyType !== 'all' && item.type !== propertyType) return false;
    if (item.ratio > discountRate) return false;
    return true;
  });

  const totalCount = filteredData.length;
  const avgRatio = totalCount > 0 ? (filteredData.reduce((acc, cur) => acc + cur.ratio, 0) / totalCount).toFixed(1) : '70.5';
  const avgProfitRate = totalCount > 0 ? (filteredData.reduce((acc, cur) => acc + cur.profitRate, 0) / totalCount).toFixed(1) : '42.0';

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 p-4 md:p-8 font-sans">
      {/* 1. 최상단 네비게이션 헤더 */}
      <header className="mb-6 pb-4 border-b border-slate-800/80 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-600/30">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-white">PropValue</h1>
              <span className="bg-blue-950 text-blue-400 border border-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                경매 & 급매 2.0
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">경매 낙찰 후 실거래 추적 & KB시세 급매 포착 플랫폼</p>
          </div>
        </div>

        {/* 상단 탭 메뉴 */}
        <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button 
            onClick={() => setActiveTab('auction')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'auction' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            🔑 낙찰 후 실거래 탐색
          </button>
          <button 
            onClick={() => setActiveTab('apt')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'apt' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            🏢 아파트 급매
          </button>
        </div>
      </header>

      {/* 2. 대시보드 지표 카드 4종 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#111827] p-4 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
          <div>
            <p className="text-slate-400 text-xs font-medium">추정된 낙찰 후 실거래 매물</p>
            <p className="text-2xl font-black text-sky-400 mt-1">{totalCount} <span className="text-sm font-normal text-slate-400">건</span></p>
          </div>
          <div className="bg-sky-950/60 p-3 rounded-xl border border-sky-800/40">
            <Building2 className="w-6 h-6 text-sky-400" />
          </div>
        </div>

        <div className="bg-[#111827] p-4 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
          <div>
            <p className="text-slate-400 text-xs font-medium">평균 실거래 대비 낙찰가율</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{avgRatio}%</p>
          </div>
          <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/40">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        <div className="bg-[#111827] p-4 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
          <div>
            <p className="text-slate-400 text-xs font-medium">평균 재매도 시세 차익률</p>
            <p className="text-2xl font-black text-pink-400 mt-1">+{avgProfitRate}%</p>
          </div>
          <div className="bg-pink-950/60 p-3 rounded-xl border border-pink-800/40">
            <DollarSign className="w-6 h-6 text-pink-400" />
          </div>
        </div>

        <div className="bg-[#111827] p-4 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
          <div>
            <p className="text-slate-400 text-xs font-medium">낙찰 후 실거래 소요 기간</p>
            <p className="text-xl font-black text-purple-400 mt-1">평균 7.4개월</p>
          </div>
          <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-800/40">
            <Clock className="w-6 h-6 text-purple-400" />
          </div>
        </div>
      </div>

      {/* 3. 국토부 실거래 데이터 필터 및 검색 바 */}
      <div className="bg-[#111827] p-5 rounded-2xl border border-slate-800 mb-6 shadow-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-bold text-slate-200">경매 낙찰 후 실거래가 찍힌 매물 검색 필터</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">지역 선택 (법정동 코드)</label>
            <select 
              value={selectedRegion} 
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-[#090d16] border border-slate-700/80 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="41135">성남시 분당구</option>
              <option value="11680">서울 강남구</option>
              <option value="11200">서울 성동구</option>
              <option value="11440">서울 마포구</option>
              <option value="11710">서울 송파구</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">조회 연월 (YYYYMM)</label>
            <input 
              type="text" 
              value={dealYmd} 
              onChange={(e) => setDealYmd(e.target.value)}
              className="w-full bg-[#090d16] border border-slate-700/80 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
              <span>낙찰가율 조건</span>
              <span className="text-blue-400 font-bold">{discountRate}% 이하</span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="95" 
              value={discountRate} 
              onChange={(e) => setDiscountRate(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <button 
            onClick={handleFetchData} 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/20"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            국토부 실거래가 연동 호출
          </button>
        </div>

        <div className="mt-3 text-xs text-blue-400 font-medium">
          상태: {statusMessage}
        </div>
      </div>

      {/* 4. 매물 리스트 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div key={item.id} className="bg-[#111827] border border-slate-800 hover:border-blue-500/50 rounded-2xl p-5 flex flex-col justify-between transition duration-200 shadow-xl">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-amber-950/80 text-amber-400 text-[11px] font-bold px-2.5 py-1 rounded-md border border-amber-800/50">
                    📌 {item.caseNo}
                  </span>
                  <span className="bg-blue-950 text-blue-400 text-[11px] font-bold px-3 py-1 rounded-full border border-blue-800">
                    실거래가 대비 {item.ratio}%
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1">{item.name}</h3>
                <p className="text-xs text-slate-400 mb-4">{item.address} ·