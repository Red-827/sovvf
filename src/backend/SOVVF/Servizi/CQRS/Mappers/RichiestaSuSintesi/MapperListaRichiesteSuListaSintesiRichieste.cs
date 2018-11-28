﻿using Modello.Classi.Soccorso;
using Modello.Classi.Soccorso.StatiRichiesta;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Servizi.CQRS.Mappers.RichiestaSuSintesi
{
    class MapperListaRichieste
    {

        public List<SintesiRichiesta> MapRichiesteSuSintesi(List<RichiestaAssistenza> ListaRichieste)
        {            
            List<SintesiRichiesta> ListaSintesi = new List<SintesiRichiesta>();

            foreach(RichiestaAssistenza elemento in ListaRichieste)
            {
                SintesiRichiesta sintesi = new SintesiRichiesta();
                string statoRichiesta = DecodifcaStatoRichiesta(elemento.StatoRichiesta);

                sintesi.codice = elemento.Codice;
                sintesi.codiceSchedaNue = elemento.CodiceSchedaNue;
                sintesi.competenze = elemento.Competenze;
                //sintesi.complessita = elemento.Richiesta.Complessita;
                sintesi.descrizione = elemento.Descrizione;
                sintesi.etichette = elemento.Tags.ToArray();
                sintesi.eventi = elemento.Eventi.ToList();
                //sintesi.fonogramma = elemento.Richiesta.StatoInvioFonogramma;
                sintesi.id = elemento.Id;
                sintesi.istantePresaInCarico = elemento.IstantePresaInCarico;
                sintesi.istantePrimaAssegnazione = elemento.IstantePrimaAssegnazione;
                
                sintesi.istanteRicezioneRichiesta = sintesi.eventi.Count > 0 ? elemento.IstanteRicezioneRichiesta : DateTime.MinValue;
                sintesi.localita = elemento.Localita;
                sintesi.operatore = elemento.Operatore;
                sintesi.partenze = elemento.ListaPartenze;
                sintesi.priorita = elemento.PrioritaRichiesta;
                sintesi.richiedente = elemento.Richiedente;
                sintesi.rilevanza = DateTime.Now;
                sintesi.stato = statoRichiesta;
                sintesi.tipologie = elemento.Tipologie;
                sintesi.zoneEmergenza = elemento.ZoneEmergenza;

                ListaSintesi.Add(sintesi);

            }

            return ListaSintesi;

        }

        public List<SintesiRichiestaMarker> MapRichiesteSuMarkerSintesi(List<RichiestaAssistenza> listaRichieste)
        {
            List<SintesiRichiestaMarker> ListaSintesi = new List<SintesiRichiestaMarker>();

            foreach (RichiestaAssistenza elemento in listaRichieste)
            {
                SintesiRichiestaMarker sintesi = new SintesiRichiestaMarker();
                string statoRichiesta = DecodifcaStatoRichiesta(elemento.StatoRichiesta);

                sintesi.id = elemento.Id;
                sintesi.localita = elemento.Localita;
                sintesi.tipologie = elemento.Tipologie;
                sintesi.label = elemento.Descrizione;
                sintesi.priorita = elemento.PrioritaRichiesta;
                sintesi.stato = statoRichiesta;
                sintesi.rilevanza = DateTime.Now;

                ListaSintesi.Add(sintesi);

            }

            return ListaSintesi;
        }

        private string DecodifcaStatoRichiesta(IStatoRichiesta statoRichiesta)
        {

            switch (statoRichiesta.ToString())
            {

                case "Modello.Classi.Soccorso.StatiRichiesta.InAttesa":
                    return "InAttesa";
                case "Modello.Classi.Soccorso.StatiRichiesta.Assegnata":
                    return "Assegnata";
                case "Modello.Classi.Soccorso.StatiRichiesta.Chiusa":
                    return "Chiusa";
                case "Modello.Classi.Soccorso.StatiRichiesta.Sospesa":
                    return "Sospesa";
                default:
                    return "Chiusa";
            }

        }


    }
}
