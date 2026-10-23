/* Explicit piece rules shared by catalogue presentation and checkout. */
(()=>{
 const perStone=new Set(['ow_l_imperial','ow_m_eternelle','ow_s_amour','ds_m_eternity','fb_m_lumiere_eternity','fb_m_knot','fb_s_eternal_promise','fb_s_amour_eternel','sl_r_curved_chevron_pave_band','sl_r_marquise_round_alternating_band','mens_regent_band','mens_atlas_band','mens_sentinel_band','mens_citadel_band','mens_axis_band']);
 window.VDDesignRules={isPerStone:p=>perStone.has(p.id)};
})();
