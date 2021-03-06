﻿using System;

namespace SO115App.FakePersistence.JSon.Classi
{
    public class BoxRichiesteDTO
    {
        public bool InAttesa { get; set; }
        public bool Aperta { get; set; }

        public bool Presidiata { get; set; }

        public bool Sospesa { get; set; }

        public DateTime IstanteRicezioneRichiesta { get; set; }

        public DateTime? IstantePrimaAssegnazione { get; set; }
    }
}
