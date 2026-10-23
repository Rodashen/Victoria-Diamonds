/* Facet diagrams shared by lab weight and natural shape controls. */
(()=>{
  function diamondIcon(name){
    const outlines={
      Round:'<circle cx="32" cy="32" r="26"/>',
      Cushion:'<rect x="8" y="8" width="48" height="48" rx="12"/>',
      Emerald:'<path d="M22 5H42L51 14V50L42 59H22L13 50V14Z"/>',
      Oval:'<ellipse cx="32" cy="32" rx="23" ry="28"/>',
      Marquise:'<path d="M32 3C59 24 59 40 32 61C5 40 5 24 32 3Z"/>'
    };
    const vertices={
      Round:[[32,6],[50.4,13.6],[58,32],[50.4,50.4],[32,58],[13.6,50.4],[6,32],[13.6,13.6]],
      Cushion:[[22,8],[42,8],[56,22],[56,42],[42,56],[22,56],[8,42],[8,22]],
      Emerald:[[22,5],[42,5],[51,14],[51,50],[42,59],[22,59],[13,50],[13,14]],
      Oval:[[32,4],[48.3,12.2],[55,32],[48.3,51.8],[32,60],[15.7,51.8],[9,32],[15.7,12.2]],
      Marquise:[[32,3],[46,18],[52,32],[46,46],[32,61],[18,46],[12,32],[18,18]]
    };
    const outer=vertices[name],scale=name==='Emerald'?.69:.55;
    const inner=outer.map(([x,y])=>[32+(x-32)*scale,32+(y-32)*scale]);
    const points=list=>list.map(p=>p.join(',')).join(' ');
    const facets=outer.map((p,i)=>`<polygon points="${points([p,outer[(i+1)%8],inner[(i+1)%8],inner[i]])}" fill="currentColor" fill-opacity="${i%2?.035:.10}" stroke-opacity=".65"/>`).join('');
    const extra=name==='Emerald'?'<path d="M24 12H40L45 17V47L40 52H24L19 47V17Z" stroke-opacity=".55"/>':outer.map((p,i)=>`<path d="M${p.join(' ')}L${inner[(i+1)%8].join(' ')}" stroke-opacity=".36"/>`).join('');
    return `<svg class="diamond-shape-art" viewBox="0 0 64 64" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round">${facets}${extra}<polygon points="${points(inner)}" fill="currentColor" fill-opacity=".07" stroke-width="1.3"/><g stroke-width="1.6">${outlines[name]}</g></svg>`;
  }
window.VDDiamondVisuals={icon:diamondIcon};
})();
