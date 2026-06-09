import React, { useState, useEffect, useRef } from 'react';
import { Settings, Hash, Copy, Printer, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // ค่าเริ่มต้นตามเอกสารอ้างอิง
  const [materialCode, setMaterialCode] = useState('101000021');
  const [productionDate, setProductionDate] = useState('');
  const [vendorCode, setVendorCode] = useState('300285');
  
  // ข้อมูลเพิ่มเติมสำหรับฉลาก
  const [lotNo, setLotNo] = useState('');
  const [palletNo, setPalletNo] = useState('1');
  const [nettWt, setNettWt] = useState('1,260.00');
  const [grossWt, setGrossWt] = useState('1,386.00');
  const [contractNo, setContractNo] = useState('');
  const [inspectorName, setInspectorName] = useState('สุคนทิพย์');

  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const printRef = useRef();

  // จัดการวันที่เป็นรูปแบบ YYMMDD สำหรับบาร์โค้ด
  const formatYYMMDD = (dateString) => {
    if (!dateString) return 'YYMMDD';
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  // จัดการรูปแบบวันที่สำหรับแสดงผลบนกระดาษให้อ่านง่าย (YYYY-MM-DD หรือ YYYY/MM/DD)
  const displayDate = productionDate ? productionDate.replace(/-/g, '/') : '\u00A0';

  useEffect(() => {
    const formattedDate = formatYYMMDD(productionDate);
    const datePart = productionDate ? formattedDate : '000000';
    const matPart = materialCode.padEnd(9, '_').slice(0, 9);
    const venPart = vendorCode.padEnd(6, '_').slice(0, 6);
    setGeneratedCode(`${matPart}${datePart}${venPart}`);
  }, [materialCode, productionDate, vendorCode]);

  const handleCopy = () => {
    if (generatedCode.includes('_')) return;
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const isCodeValid = generatedCode.length === 21 && !generatedCode.includes('_');

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between print:hidden">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Hash className="text-blue-600" />
              โปรแกรมสร้างบาร์โค้ด 21 หลัก
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Input Form */}
          <div className="lg:col-span-5 space-y-6 print:hidden">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-500" />
                ข้อมูลบาร์โค้ด
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">รหัสสินค้า (Material Code) - 9 หลัก</label>
                  <input type="text" maxLength={9} value={materialCode} onChange={(e) => setMaterialCode(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))} className={`w-full px-4 py-2 rounded-lg border ${materialCode.length !== 9 ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} focus:outline-none focus:ring-2`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">วันที่ผลิต (Production Date)</label>
                  <input type="date" value={productionDate} onChange={(e) => setProductionDate(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผู้ผลิต (Vendor Code) - 6 หลัก</label>
                  <input type="text" maxLength={6} value={vendorCode} onChange={(e) => setVendorCode(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))} className={`w-full px-4 py-2 rounded-lg border ${vendorCode.length !== 6 ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} focus:outline-none focus:ring-2`} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-500" />
                ข้อมูลในตารางฉลาก
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LOT NO.</label>
                  <input type="text" value={lotNo} onChange={(e) => setLotNo(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:outline-none focus:ring-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PALLET NO.</label>
                  <input type="text" value={palletNo} onChange={(e) => setPalletNo(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:outline-none focus:ring-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NETT WT.</label>
                  <input type="text" value={nettWt} onChange={(e) => setNettWt(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:outline-none focus:ring-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GROSS WT.</label>
                  <input type="text" value={grossWt} onChange={(e) => setGrossWt(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:outline-none focus:ring-2" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">CONTRACT NO</label>
                  <input type="text" value={contractNo} onChange={(e) => setContractNo(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:outline-none focus:ring-2" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ตรวจสอบ</label>
                  <input type="text" value={inspectorName} onChange={(e) => setInspectorName(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:outline-none focus:ring-2" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Preview & Output */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6 print:hidden">
                <h2 className="text-lg font-semibold text-gray-800">แสดงผล A5 (Print Preview)</h2>
                <div className="flex gap-2">
                  <button onClick={handleCopy} disabled={!isCodeValid} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${!isCodeValid ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    คัดลอกรหัส
                  </button>
                  <button onClick={handlePrint} disabled={!isCodeValid} className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${!isCodeValid ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                    <Printer className="w-4 h-4" />
                    พิมพ์บาร์โค้ด
                  </button>
                </div>
              </div>

              {/* The Label Preview Area (จำลองให้เหมือนกระดาษจริงที่สุด) */}
              <div className="flex-1 flex items-center justify-center bg-gray-200 rounded-lg p-4 md:p-8 border border-gray-300 print:bg-white print:border-none print:p-0 overflow-auto">
                
                {/* Physical Label Mockup (ลดความหนาเส้นขอบ เปลี่ยนฟอนต์ให้เหมือนฟอร์มจริง) */}
                <div ref={printRef} className="label-container bg-white border border-black w-full max-w-2xl text-black flex flex-col font-serif print:w-[100%] print:h-[95vh] print:max-w-none print:border print:border-black print:mx-auto">
                  
                  {/* Header Area */}
                  <div className="h-16 md:h-20 w-full border-b border-black shrink-0 relative overflow-hidden flex items-center">
                    {/* เว้นว่างไว้เหมือนแบบฟอร์มจริงที่มีการพรางโลโก้ */}
                  </div>

                  {/* Table Section */}
                  <table className="w-full border-collapse grow text-sm md:text-[15px]">
                    <tbody>
                      <tr>
                        <td className="border-b border-r border-black px-4 py-3 uppercase w-[35%] tracking-wide">PRODUCTION DATE</td>
                        <td className="border-b border-black px-4 py-3 text-center">{displayDate}</td>
                      </tr>
                      <tr>
                        <td className="border-b border-r border-black px-4 py-3 uppercase tracking-wide">LOT NO.</td>
                        <td className="border-b border-black px-4 py-3 text-center">{lotNo || '\u00A0'}</td>
                      </tr>
                      <tr>
                        <td className="border-b border-r border-black px-4 py-3 uppercase tracking-wide">PALLET NO.</td>
                        <td className="border-b border-black px-4 py-3 text-center">{palletNo || '\u00A0'}</td>
                      </tr>
                      <tr>
                        <td className="border-b border-r border-black px-4 py-3 uppercase tracking-wide">NETT WT.</td>
                        <td className="border-b border-black px-4 py-3 text-center">{nettWt ? `${nettWt} KGS.` : '\u00A0'}</td>
                      </tr>
                      <tr>
                        <td className="border-b border-r border-black px-4 py-3 uppercase tracking-wide">GROSS WT.</td>
                        <td className="border-b border-black px-4 py-3 text-center">{grossWt ? `${grossWt} KGS.` : '\u00A0'}</td>
                      </tr>
                      <tr>
                        <td className="border-b border-r border-black px-4 py-3 uppercase tracking-wide">CONTRACT NO</td>
                        <td className="border-b border-black px-4 py-3 text-center">{contractNo || '\u00A0'}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Barcode and Signature Section */}
                  <div className="flex justify-between items-end p-4 md:px-6 md:py-8 shrink-0 min-h-[140px] md:min-h-[180px]">
                    <div className="w-[60%] flex flex-col justify-end">
                      {isCodeValid ? (
                        <img 
                          src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${generatedCode}&scale=3&includetext=true&textyoffset=5`} 
                          alt="Barcode" 
                          className="h-20 md:h-28 object-contain object-left mix-blend-multiply"
                        />
                      ) : (
                        <div className="h-20 md:h-28 flex items-center text-xs text-red-500">
                          (รอข้อมูลบาร์โค้ด)
                        </div>
                      )}
                    </div>
                    
                    <div className="w-[40%] text-right text-sm md:text-base whitespace-nowrap mb-2 md:mb-4">
                      ผู้ตรวจสอบ........<span className="inline-block min-w-[80px] text-center">{inspectorName}</span>........
                    </div>
                  </div>
                </div>

              </div>
              
              {!isCodeValid && (
                 <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start gap-2 text-sm print:hidden">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="font-semibold">ไม่สามารถสร้างบาร์โค้ดได้</p>
                      <p>กรุณาตรวจสอบว่า: กรอกรหัสสินค้า 9 หลัก, เลือกวันที่ผลิต, และกรอกรหัสผู้ผลิต 6 หลักครบถ้วน</p>
                    </div>
                 </div>
              )}

            </div>
          </div>
        </div>

      </div>

      {/* Global CSS for Printing perfectly on A5 Landscape */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Tinos:wght@400;700&display=swap');

        .font-serif {
          font-family: 'Tinos', 'Times New Roman', serif;
        }

        @media print {
          @page {
            size: A5 landscape;
            margin: 10mm; /* ระยะขอบกระดาษจริงตอนปริ้น */
          }
          
          body * {
            visibility: hidden;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          /* ให้เฉพาะ Label Container แสดงผลเต็มหน้า A5 */
          .label-container, .label-container * {
            visibility: visible;
          }
          
          .label-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            height: 98% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: 1px solid black !important;
          }

          /* ขยายขนาดตัวอักษรและระยะห่างสำหรับ A5 */
          .label-container table td {
            font-size: 14pt !important;
            padding: 10px 16px !important;
            border-color: black !important;
          }
          
          .label-container .text-right {
            font-size: 14pt !important;
          }

          /* บังคับพิมพ์สีขาว-ดำคมชัด */
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}} />
    </div>
  );
}