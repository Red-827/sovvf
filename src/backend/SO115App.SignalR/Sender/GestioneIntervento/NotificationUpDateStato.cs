﻿//-----------------------------------------------------------------------
// <copyright file="NotificationUpDateChiamata.cs" company="CNVVF">
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

using AutoMapper;
using CQRS.Queries;
using DomainModel.CQRS.Commands.UpDateIntervento;
using DomainModel.CQRS.Commands.UpDateStatoRichiesta;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Classi.Marker;
using SO115App.API.Models.Servizi.CQRS.Command.GestioneSoccorso.Shared;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiRichiesteAssistenzaMarker;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneIntervento;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneChiamata
{
    public class NotificationUpDateStato : INotifyUpDateStatoRichiesta
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> _BoxRichiestehandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> _SintesiRichiesteAssistenzaMarkerhandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> sintesiRichiesteAssistenzahandler;
        private readonly IMapper _mapper;

        public NotificationUpDateStato(IHubContext<NotificationHub> NotificationHubContext,
                                          IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> BoxRichiestehandler,
                                          IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> SintesiRichiesteAssistenzaMarkerhandler,
                                          IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> SintesiRichiesteAssistenzahandler,
                                          IMapper mapper
            )
        {
            _notificationHubContext = NotificationHubContext;
            _BoxRichiestehandler = BoxRichiestehandler;
            _SintesiRichiesteAssistenzaMarkerhandler = SintesiRichiesteAssistenzaMarkerhandler;
            sintesiRichiesteAssistenzahandler = SintesiRichiesteAssistenzahandler;
            _mapper = mapper;
        }

        public async Task SendNotification(UpDateStatoRichiestaCommand richiesta)
        {
            var SintesiRichiesteAssistenzaquery = new SintesiRichiesteAssistenzaQuery();
            var ListaSintesi = (List<SintesiRichiesta>)this.sintesiRichiesteAssistenzahandler.Handle(SintesiRichiesteAssistenzaquery).SintesiRichiesta;

            var BoxRichiestequery = new BoxRichiesteQuery();
            BoxInterventi boxInterventi = new BoxInterventi();
            boxInterventi = (BoxInterventi)this._BoxRichiestehandler.Handle(BoxRichiestequery).BoxRichieste;

            var query = new SintesiRichiesteAssistenzaMarkerQuery();
            List<SintesiRichiestaMarker> listaSintesiMarker = new List<SintesiRichiestaMarker>();
            listaSintesiMarker = (List<SintesiRichiestaMarker>)this._SintesiRichiesteAssistenzaMarkerhandler.Handle(query).SintesiRichiestaMarker;
            richiesta.Chiamata = ListaSintesi.LastOrDefault(sintesi => sintesi.Codice == richiesta.Chiamata.Codice);

            await _notificationHubContext.Clients.Group(richiesta.Chiamata.Operatore.Sede.Codice).SendAsync("ModifyAndNotifySuccess", richiesta);
            await _notificationHubContext.Clients.Group(richiesta.Chiamata.Operatore.Sede.Codice).SendAsync("NotifyGetBoxInterventi", boxInterventi);
            await _notificationHubContext.Clients.Group(richiesta.Chiamata.Operatore.Sede.Codice).SendAsync("NotifyGetRichiestaUpDateMarker", listaSintesiMarker.LastOrDefault(marker => marker.Codice == richiesta.Chiamata.Codice));
        }
    }
}