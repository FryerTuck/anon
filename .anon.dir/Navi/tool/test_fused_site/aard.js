"use strict";

// requires(['/Navi/tool/test_fused_site/aard.css']);


extend(Anon.Navi.tool)
({
    test_fused_site:function(tab, panl)
    {
        panl=tab.body.select(`.NaviViewPanl`)[0];
        panl.insert({layr:
        [
            {iframe:`.spanFull`, src:(HOSTPURL+'/?ANONREPOTEST')}
        ]});
    },
});
