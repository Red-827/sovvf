﻿//-----------------------------------------------------------------------
// <copyright file="GetMezziBySelettiva.cs" company="CNVVF">
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
    ///   Servizio che recupera una lista di mezzi dal GAC fake a partire dal loro codice radio (Trasmittente).
    /// </summary>
    public class GetMezziBySelettiva : IGetMezziBySelettiva
    {
        private readonly HttpClient _client;
        private readonly MapMezzoDTOsuMezzo _mapper;
        private readonly IConfiguration _configuration;

        public GetMezziBySelettiva(HttpClient client, MapMezzoDTOsuMezzo mapper, IConfiguration configuration)
        {
            _client = client;
            _mapper = mapper;
            _configuration = configuration;
        }

        /// <summary>
        ///   Restituisce la lista fake dei mezzi
        /// </summary>
        /// <param name="idRadio">una lista di codici radio</param>
        /// <returns>una lista mezzi</returns>
        public List<Mezzo> Get(List<string> idRadio)
        {
            var response = _client.GetAsync($"{_configuration.GetSection("UrlExternalApi").GetSection("GacApi").Value}{Costanti.GacGetSELETTIVA}?idRadio={idRadio}").ToString();
            var listaMezzoDTO = JsonConvert.DeserializeObject<List<MezzoDTO>>(response);
            return _mapper.MappaMezzoDTOsuMezzo(listaMezzoDTO);
        }
    }
}