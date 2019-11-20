﻿//-----------------------------------------------------------------------
// <copyright file="GetMezziFuoriServizio.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF.
// SOVVF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.
// </copyright>
//-----------------------------------------------------------------------
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.ExternalAPI.Fake.Classi.Gac;
using SO115App.ExternalAPI.Fake.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.Gac
{
    /// <summary>
    ///   Servizio che recupera da GAC fake una lista di mezzi fuori servizio.
    /// </summary>
    public class GetMezziFuoriServizio : IGetMezziFuoriServizio
    {
        private readonly HttpClient _client;
        private readonly MapMezzoDTOsuMezzo _mapper;
        private readonly IConfiguration _configuration;

        public GetMezziFuoriServizio(HttpClient client, MapMezzoDTOsuMezzo mapper, IConfiguration configuration)
        {
            _client = client;
            _mapper = mapper;
            _configuration = configuration;
        }

        /// <summary>
        ///   Restituisce la lista fake dei mezzi fuori servizio
        /// </summary>
        /// <param name="sedi">una lista di codici sede</param>
        /// <param name="genereMezzo">il genere del mezzo (opzionale)</param>
        /// <param name="siglaMezzo">la sigla del mezzo (opzionale)</param>
        /// <returns>una lista mezzi</returns>
        public List<Mezzo> Get(List<string> sedi, string genereMezzo, string siglaMezzo)
        {
            var response = _client.GetAsync($"{_configuration.GetSection("UrlExternalApi").GetSection("GacApi").Value}{Costanti.GacGetMezziFuoriServizio}?sedi{sedi}&genereMezzo={genereMezzo}&siglaMezzo={siglaMezzo}").ToString();
            var listaMezzoDTO = JsonConvert.DeserializeObject<List<MezzoDTO>>(response);
            return _mapper.MappaMezzoDTOsuMezzo(listaMezzoDTO);
        }
    }
}