﻿using SO115App.Models.Classi.Marker;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.Marker
{
    public interface IGetChiamateInCorso
    {
        List<ChiamateInCorso> Get();
    }
}
