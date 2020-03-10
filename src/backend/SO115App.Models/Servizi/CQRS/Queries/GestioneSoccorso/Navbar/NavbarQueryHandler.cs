﻿//-----------------------------------------------------------------------
// <copyright file="NavbarQueryHandler.cs" company="CNVVF">
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
using CQRS.Queries;
using SO115App.Models.Servizi.CQRS.Queries.GestioneRuoli.GetRuoliByIdUtente;
using SO115App.Models.Servizi.Infrastruttura.NavBar;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Navbar
{
    /// <summary>
    ///   Servizio che restituisce tutti i valori della Navbar.
    /// </summary>
    public class NavbarQueryHandler : IQueryHandler<NavbarQuery, NavbarResult>
    {
        private readonly IGetNavbar _iGetNavbar;
        private readonly IGetAlberaturaUnitaOperative _alberaturaUO;
        private readonly IQueryHandler<GetRuoliQuery, GetRuoliResult> _queryRuoli;

        public NavbarQueryHandler(IGetNavbar iGetNavbar, IGetAlberaturaUnitaOperative alberaturaUO, IQueryHandler<GetRuoliQuery, GetRuoliResult> queryRuoli)
        {
            this._iGetNavbar = iGetNavbar;
            this._alberaturaUO = alberaturaUO;
            _queryRuoli = queryRuoli;
        }

        /// <summary>
        ///   Query che estrae i valori dei Box presenti in Home Page
        /// </summary>
        /// <param name="query">Filtri utilizzati per l'estrazione</param>
        /// <returns>Elenco dei mezzi disponibili</returns>
        public NavbarResult Handle(NavbarQuery query)
        {
            var queryRuoli = new GetRuoliQuery
            {
                IdUtente = query.IdUtente
            };
            var navbars = _iGetNavbar.Get();
            navbars.ListaSedi = _alberaturaUO.ListaSediAlberata();
            navbars.RuoliUtLoggato = _queryRuoli.Handle(queryRuoli).Ruoli;

            return new NavbarResult()
            {
                Navbar = navbars
            };
        }
    }
}
