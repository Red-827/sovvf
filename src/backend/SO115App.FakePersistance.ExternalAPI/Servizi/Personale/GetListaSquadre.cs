using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.ExternalAPI.Fake.Classi.DTOFake;
using SO115App.Models.Classi.Utenti.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Squadre;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.Personale
{
    public class GetListaSquadre : IGetListaSquadre
    {
        private readonly IGetDistaccamentoByCodiceSedeUC _getDistaccamentoByCodiceSedeUC;
        private readonly IGetPersonaleByCF _getPersonaleByCF;
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        public GetListaSquadre(IGetDistaccamentoByCodiceSedeUC GetDistaccamentoByCodiceSedeUC, IGetPersonaleByCF GetPersonaleByCF, HttpClient client, IConfiguration configuration)
        {
            _getDistaccamentoByCodiceSedeUC = GetDistaccamentoByCodiceSedeUC;
            _getPersonaleByCF = GetPersonaleByCF;
            _client = client;
            _configuration = configuration;
        }

        public async Task<List<Squadra>> Get(List<string> sedi)
        {
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
            var response = await _client.GetAsync($"{_configuration.GetSection("ApiFake").GetSection("SquadreController").Value}?CodComando={sedi.Single()}").ConfigureAwait(false);
            response.EnsureSuccessStatusCode();
            using HttpContent content = response.Content;
            string data = await content.ReadAsStringAsync().ConfigureAwait(false);
            var listaSquadraFake = JsonConvert.DeserializeObject<List<SquadraFake>>(data);
            var listaSquadre = new List<Squadra>();
            var listaCodiciSedi = new List<string>();

            foreach (string sede in sedi)
            {
                var codice = sede.Substring(0, 2);
                string codiceE = "";
                codiceE = listaCodiciSedi.Find(x => x.Equals(codice));
                if (string.IsNullOrEmpty(codiceE))
                {
                    listaCodiciSedi.Add(codice);
                }
            }

            var listaMezzi = new List<Mezzo>();
            foreach (string CodSede in listaCodiciSedi)
            {
                foreach (SquadraFake squadraFake in listaSquadraFake.FindAll(x => x.Sede.Contains(CodSede)))
                {
                    var squadra = MapSqaudra(squadraFake, CodSede);
                    listaSquadre.Add(squadra);
                }
            }

            return listaSquadre;
        }

        private Squadra MapSqaudra(SquadraFake squadraFake, string CodSede)
        {
            var Stato = squadraFake.Stato switch
            {
                "L" => Squadra.StatoSquadra.InSede,
                "A" => Squadra.StatoSquadra.SulPosto,
                "R" => Squadra.StatoSquadra.InRientro,
                _ => Squadra.StatoSquadra.InSede,
            };
            var distaccamento = _getDistaccamentoByCodiceSedeUC.Get(squadraFake.Sede).Result;
            var sedeDistaccamento = new Sede(squadraFake.Sede, distaccamento.DescDistaccamento, distaccamento.Indirizzo, distaccamento.Coordinate, "", "", "", "", "");

            List<string> ListaCodiciFiscaliComponentiSquadra = new List<string>();
            List<Componente> ComponentiSquadra = new List<Componente>();
            foreach (string cf in squadraFake.ListaCodiciFiscaliComponentiSquadra)
            {
                PersonaleVVF pVVf = _getPersonaleByCF.Get(cf).Result;

                const bool capoPartenza = false; const bool autista = false;
                Componente c = new Componente("", pVVf.Nominativo, pVVf.Nominativo, capoPartenza, autista, false)
                {
                    CodiceFiscale = pVVf.CodFiscale,
                };
            }

            Squadra s = new Squadra(squadraFake.NomeSquadra, Stato, ComponentiSquadra, sedeDistaccamento);

            s.Id = squadraFake.CodiceSquadra;
            s.ListaCodiciFiscaliComponentiSquadra = ListaCodiciFiscaliComponentiSquadra;
            return s;
        }
    }
}
