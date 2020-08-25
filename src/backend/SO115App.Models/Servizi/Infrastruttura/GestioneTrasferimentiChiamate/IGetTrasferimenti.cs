﻿using SO115App.Models.Classi.Condivise;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneTrasferimentiChiamate
{
    public interface IGetTrasferimenti
    {
        List<TrasferimentoChiamata> GetAll(string[] CodiciSedi);
        int Count(string[] CodiciSedi);
    }
}
