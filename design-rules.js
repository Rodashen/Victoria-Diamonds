/* Explicit piece rules shared by catalogue presentation and checkout. */
(()=>{
 const perStone=new Set(['ow_l_imperial','ow_m_eternelle','ow_s_amour','ds_m_eternity','fb_m_lumiere_eternity','fb_m_knot','fb_s_eternal_promise','fb_s_amour_eternel','sl_r_curved_chevron_pave_band','sl_r_marquise_round_alternating_band','mens_regent_band','mens_atlas_band','mens_sentinel_band','mens_citadel_band','mens_axis_band']);
 // Accent presets remain pricing inputs, never customer-editable specifications.
 const diamonds=p=>p.preset?.diamonds||p.diamonds||[];
 const isAccent=(p,i)=>i>0&&(!!p.haloDesign||!!p.lockAccentSize||!!p.preset?.lockAccentSize||Number(diamonds(p)[i]?.carat)<=0.20||(Number(diamonds(p)[i]?.carat)<=0.25&&diamonds(p)[i]?.qty>=10));
 const hasAccents=p=>diamonds(p).some((d,i)=>isAccent(p,i));
 const publicDetails=p=>(p.details||[]).filter(d=>!['hiddenHalo','paveBand','secondarySide','finishingSide'].includes(d.key)&&!(hasAccents(p)&&['sideStone','mainSide','stoneCount','totalKarat','info'].includes(d.key)));
 window.VDDesignRules={isPerStone:p=>perStone.has(p.id),isAccent,hasAccents,publicDetails};
})();
