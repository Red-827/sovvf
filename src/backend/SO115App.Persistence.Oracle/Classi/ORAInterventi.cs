﻿using System;

namespace SO115App.Persistence.Oracle.Classi
{
   public class ORAInterventi
	{
        public ORAInterventi()
        {
        }
		/// <SUMMARY>
		///   CAMPO INTERVENTO DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public decimal INTERVENTO { get; set; }


		/// <SUMMARY>
		///   CAMPO DATA_CHIAMATA DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public DateTime DATA_CHIAMATA { get; set; }



		/// <SUMMARY>
		///   CAMPO ORA_CHIAMATA DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string ORA_CHIAMATA { get; set; }




		/// <SUMMARY>
		///   CAMPO DATA_INTERVENTO DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public DateTime DATA_INTERVENTO { get; set; }



		/// <SUMMARY>
		///   CAMPO ORA_USCITA DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string ORA_USCITA { get; set; }

		/// <SUMMARY>
		///   CAMPO TURNO_CHIAMATA DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string TURNO_CHIAMATA { get; set; }


		/// <SUMMARY>
		///   CAMPO TURNO_INTERVENTO DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string TURNO_INTERVENTO { get; set; }



		// COD_TIPOLOGIA NUMBER(3)
		// DETTAGLIO_TIPOLOGIA VARCHAR2(60)
		// NOTE_INTERVENTO LONG
		// LOC_INDIRIZZO VARCHAR2(1)
		// LOCALITA VARCHAR2(300)
		// COD_STRADA VARCHAR2(20)

		/// <SUMMARY>
		///   CAMPO COD_TIPOLOGIA DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public decimal COD_TIPOLOGIA { get; set; }


		/// <SUMMARY>
		///   CAMPO DETTAGLIO_TIPOLOGIA DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string DETTAGLIO_TIPOLOGIA { get; set; }


		/// <SUMMARY>
		///   CAMPO NOTE_INTERVENTO DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string NOTE_INTERVENTO { get; set; }



		/// <SUMMARY>
		///   CAMPO LOC_INDIRIZZO DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string LOC_INDIRIZZO { get; set; }

		/// <SUMMARY>
		///   CAMPO LOCALITA DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string LOCALITA { get; set; }


		/// <SUMMARY>
		///   CAMPO COD_STRADA DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string COD_STRADA { get; set; }


		// NUM_CIVICO VARCHAR2(10)
		// COD_COMUNE NUMBER(6)
		// SIGLA_PROVINCIA VARCHAR2(2)
		// RICHIEDENTE VARCHAR2(40)
		// TELE_NUMERO VARCHAR2(70)
		// COMANDO VARCHAR2(2)
		// SCHEDA_ALTRO_COMANDO VARCHAR2(5)


		/// <SUMMARY>
		///   CAMPO NUM_CIVICO DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string NUM_CIVICO { get; set; }

		/// <SUMMARY>
		///   CAMPO COD_COMUNE DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public decimal COD_COMUNE { get; set; }


		/// <SUMMARY>
		///   CAMPO SIGLA_PROVINCIA DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string SIGLA_PROVINCIA { get; set; }


		/// <SUMMARY>
		///   CAMPO RICHIEDENTE DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string RICHIEDENTE { get; set; }

		/// <SUMMARY>
		///   CAMPO TELE_NUMERO DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string TELE_NUMERO { get; set; }


		/// <SUMMARY>
		///   CAMPO COMANDO DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string COMANDO { get; set; }


		/// <SUMMARY>
		///   CAMPO SCHEDA_ALTRO_COMANDO DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string SCHEDA_ALTRO_COMANDO { get; set; }


		// NATURA VARCHAR2(40)
		// MATRICOLA_OPERATORE_CHIAMATA VARCHAR2(16)
		// MATRICOLA_OPERATORE_INTERVENTO VARCHAR2(16)
		// STATUS VARCHAR2(1)
		// ENTI_intERVENUTI VARCHAR2(1)
		// RICEVUTA_TRASMESSA VARCHAR2(1)
		// COD_OBIETTIVO NUMBER(4)
		// COD_STRADA_INCROCIO VARCHAR2(20)


		/// <SUMMARY>
		///   CAMPO NATURA DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string NATURA { get; set; }


		/// <SUMMARY>
		///   CAMPO MATRICOLA_OPERATORE_CHIAMATA DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string MATRICOLA_OPERATORE_CHIAMATA { get; set; }



		/// <SUMMARY>
		///   CAMPO MATRICOLA_OPERATORE_INTERVENTO DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string MATRICOLA_OPERATORE_INTERVENTO { get; set; }

		/// <SUMMARY>
		///   CAMPO STATUS DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string STATUS { get; set; }


		/// <SUMMARY>
		///   CAMPO ENTI_intERVENUTI DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string ENTI_INTERVENUTI { get; set; }



		/// <SUMMARY>
		///   CAMPO RICEVUTA_TRASMESSA DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string RICEVUTA_TRASMESSA { get; set; }


		/// <SUMMARY>
		///   CAMPO COD_OBIETTIVO DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public decimal COD_OBIETTIVO { get; set; }


		/// <SUMMARY>
		///   CAMPO COD_STRADA_INCROCIO DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string COD_STRADA_INCROCIO { get; set; }
			   

		/// <SUMMARY>
		///   CAMPO FLAG_CIV_KM DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string FLAG_CIV_KM { get; set; }

		/// <SUMMARY>
		///   CAMPO COD_PRIORITA DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string COD_PRIORITA { get; set; }


		/// <SUMMARY>
		///   CAMPO PROGR_INTERVENTO DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public decimal PROGR_INTERVENTO { get; set; }



		/// <SUMMARY>
		///   CAMPO EDGID_STRADA DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public decimal EDGID_STRADA { get; set; }


		/// <SUMMARY>
		///   CAMPO CODICE_PI DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public decimal CODICE_PI { get; set; }


		/// <SUMMARY>
		///   CAMPO FLAG_DOC_SN DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string FLAG_DOC_SN { get; set; }



		/// <SUMMARY>
		///   CAMPO INTERVENTO_RILEVANTE DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string INTERVENTO_RILEVANTE { get; set; }




		/// <SUMMARY>
		///   CAMPO BOSCHI DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public decimal BOSCHI { get; set; }


		/// <SUMMARY>
		///   CAMPO CAMPI DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public decimal CAMPI { get; set; }



		/// <SUMMARY>
		///   CAMPO STERPAGLIE DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public decimal STERPAGLIE { get; set; }


		/// <SUMMARY>
		///   CAMPO X DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public decimal X { get; set; }


		/// <SUMMARY>
		///   CAMPO Y DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public decimal Y { get; set; }



		/// <SUMMARY>
		///   CAMPO ID_INCROCIO DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public decimal ID_INCROCIO { get; set; }

		/// <SUMMARY>
		///   CAMPO CHIAMATA DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public decimal CHIAMATA { get; set; }

		/// <SUMMARY>
		///   CAMPO ID_ZONA DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public decimal ID_ZONA { get; set; }


		/// <SUMMARY>
		///   CAMPO DESC_LUOGO DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string DESC_LUOGO { get; set; }



		/// <SUMMARY>
		///   CAMPO FLAG_R DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string FLAG_R { get; set; }


		/// <SUMMARY>
		///   CAMPO ID_112 DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public decimal ID_112 { get; set; }


		/// <SUMMARY>
		///   CAMPO COD_DIST_PREALL DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public decimal COD_DIST_PREALL { get; set; }



		/// <SUMMARY>
		///   CAMPO ZONA_EMERGENZA DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string ZONA_EMERGENZA { get; set; }


	

		/// <SUMMARY>
		///   CAMPO PALAZZO DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string PALAZZO { get; set; }


		/// <SUMMARY>
		///   CAMPO SCALA DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string SCALA { get; set; }



		/// <SUMMARY>
		///   CAMPO PIANO DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string PIANO { get; set; }


		/// <SUMMARY>
		///   CAMPO INTERNO DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string INTERNO { get; set; }


		/// <SUMMARY>
		///   CAMPO DATAORA_ARRIVO DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public DateTime? DATAORA_ARRIVO { get; set; }


		/// <SUMMARY>
		///   CAMPO NUM_FONOGRAMMA DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string NUM_FONOGRAMMA { get; set; }

		/// <SUMMARY>
		///   CAMPO NUM_PROTOCOLLO_FONO DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string NUM_PROTOCOLLO_FONO { get; set; }


		/// <SUMMARY>
		///   CAMPO CIVICO_VICINO DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string CIVICO_VICINO { get; set; }



		/// <SUMMARY>
		///   CAMPO DUMMY_SIGLA_PROVENIENZA DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public string DUMMY_SIGLA_PROVENIENZA { get; set; }


		/// <SUMMARY>
		///   CAMPO DUMMY_DATA_EXPORT DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public DateTime? DUMMY_DATA_EXPORT { get; set; }


		/// <SUMMARY>
		///   CAMPO DUMMY_NUM_INTERVENTO DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public decimal DUMMY_NUM_INTERVENTO { get; set; }



		/// <SUMMARY>
		///   CAMPO DUMMY_DATA_INTERVENTO DELLA TABELLA INTERVENTI
		/// </SUMMARY>
		public DateTime? DUMMY_DATA_INTERVENTO { get; set; }


	}
}
