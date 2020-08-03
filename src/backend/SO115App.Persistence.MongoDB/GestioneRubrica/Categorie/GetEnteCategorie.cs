﻿using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Categorie;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneRubrica.Categorie
{
    public class GetEnteCategorie : IGetEnteCategorie
    {
        private readonly DbContext _dbContext;
        public GetEnteCategorie(DbContext dbContext) => _dbContext = dbContext;

        public List<EnteCategoria> Get(string[] codici)
        {
            return _dbContext.CategorieEntiCollection.Find(c => codici.Contains(c.Codice)).ToList();
        }
    }
}