﻿using SO115App.Models.Classi.Condivise;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Categorie
{
    public interface IGetEnteCategorie
    {
        List<EnteCategoria> Get(string[] codici);
    }
}