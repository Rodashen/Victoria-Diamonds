/* Select one priced mid-range grade for the complete natural tennis bracelet. */
(()=>{
 'use strict';
 const colours=['H','I','J','K'],clarities=['SI1','VS2','VS1'];
 function totalCarat(product,record){
  const listed=parseFloat(product.details?.find(d=>d.key==='totalKarat')?.value);
  return Number.isFinite(listed)?listed:(record?.naturalDesign||[]).reduce((sum,d)=>sum+Number(d.carat)*Number(d.qty),0);
 }
 function select(items,shape,carat,total){
  const qty=Math.round(total/Number(carat));
  if(!Number.isFinite(total)||!Number.isInteger(qty)||qty<1||qty>100||Math.abs(qty*Number(carat)-total)>0.00001)return null;
  const candidates=items.filter(d=>d.shape===shape&&Number(d.carat)===Number(carat)&&['I','J'].includes(d.colour)&&d.clarity==='VS2'&&d.cut==='Excellent').sort((a,b)=>a.price-b.price||a.id.localeCompare(b.id));
  // H–K has two central colour grades, I and J. VS2 is between SI1 and VS1.
  // Use the actual catalogue combination nearest their midpoint price.
  // Its ID lets the payment server verify the price; never send a client-invented average.
  if(!candidates.length)return null;
  const midpoint=(candidates[0].price+candidates[candidates.length-1].price)/2;
  const stone=candidates.reduce((best,d)=>Math.abs(d.price-midpoint)<Math.abs(best.price-midpoint)?d:best);
  return {...stone,qty};
 }
 window.VDTennisNatural={select,totalCarat,colours,clarities};
})();
