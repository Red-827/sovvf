﻿//-----------------------------------------------------------------------
// <copyright file="GetMezziMarker.cs" company="CNVVF">
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
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Geo;
using SO115App.API.Models.Classi.Marker;
using SO115App.FakePersistence.JSon.Utility;
using SO115App.Models.Servizi.Infrastruttura.Marker;

namespace SO115App.FakePersistenceJSon.Marker
{
    public class GetCentroMappa : IGetCentroMappaMarker
    {
        public CentroMappa GetCentroMappaMarker(string codiceSede)
        {
            var codiceSedeCentroMappa = codiceSede.Substring(0, 2) + ".1000";
            var filepath = CostantiJson.MarkerSedi;
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            var listaSedi = JsonConvert.DeserializeObject<List<SedeMarker>>(json);
            var sedeCentroMappa = listaSedi.FirstOrDefault(x => x.Codice == codiceSedeCentroMappa);

            if (sedeCentroMappa != null)
                return new CentroMappa()
                {
                    CoordinateCentro = sedeCentroMappa.Coordinate,
                    Zoom = 10
                };

            return null;
        }
    }
}
