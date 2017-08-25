﻿//-----------------------------------------------------------------------
// <copyright file="TestRichiestaAssistenzaMezzi.cs" company="CNVVF">
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
using System;
using System.Collections.Generic;
using System.Linq;
using Modello.Classi.Soccorso;
using Modello.Classi.Soccorso.Eventi.Partenze;
using Modello.Classi.Soccorso.Mezzi.StatiMezzo;
using NUnit.Framework;

namespace Modello.Test.Classi.Soccorso
{
    [TestFixture]
    [Ignore("Le implementazioni non sono ancora pronte")]
    public class TestRichiestaAssistenzaMezzi
    {
        [Test]
        public void UnaRichiestaVuotaNonHaMezziCoinvolti()
        {
            var richiesta = new RichiestaAssistenza();

            var mezziCoinvolti = richiesta.MezziCoinvolti;

            CollectionAssert.IsEmpty(mezziCoinvolti);
        }

        [Test]
        public void UnaRichiestaConUnMezzoAssegnatoRestituisceUnMezzoCoinvolto()
        {
            var richiesta = new RichiestaAssistenza();
            new ComposizionePartenze(richiesta, DateTime.Now, "fonte")
            {
                Componenti = new HashSet<ComponentePartenza>()
                {
                    new ComponentePartenza("XXX", "M1")
                }
            };

            var mezziCoinvolti = richiesta.MezziCoinvolti;

            Assert.That(mezziCoinvolti, Has.Count.EqualTo(1));
        }

        [Test]
        public void UnaRichiestaConUnMezzoAssegnatoRestituisceIlCodiceDelMezzoCoinvolto()
        {
            var richiesta = new RichiestaAssistenza();
            new ComposizionePartenze(richiesta, DateTime.Now, "fonte")
            {
                Componenti = new HashSet<ComponentePartenza>()
                {
                    new ComponentePartenza("XXX", "M1")
                }
            };

            var mezziCoinvolti = richiesta.MezziCoinvolti;
            var codiceMezzo = mezziCoinvolti.Keys.Single();

            Assert.That(codiceMezzo, Is.EqualTo("M1"));
        }

        [Test]
        public void UnaRichiestaConUnMezzoAssegnatoRestituisceLoStatoAssegnato()
        {
            var richiesta = new RichiestaAssistenza();
            new ComposizionePartenze(richiesta, DateTime.Now, "fonte")
            {
                Componenti = new HashSet<ComponentePartenza>()
                {
                    new ComponentePartenza("XXX", "M1")
                }
            };

            var mezziCoinvolti = richiesta.MezziCoinvolti;
            var stato = mezziCoinvolti["M1"];

            Assert.That(stato, Is.InstanceOf<Assegnato>());
        }

        [Test]
        public void UnaRichiestaConUnMezzoUscitoRestituisceUnMezzoCoinvolto()
        {
            var richiesta = new RichiestaAssistenza();
            new ComposizionePartenze(richiesta, DateTime.Now, "fonte")
            {
                Componenti = new HashSet<ComponentePartenza>()
                {
                    new ComponentePartenza("XXX", "M1")
                }
            };
            new UscitaPartenza(richiesta, "M1", DateTime.Now, "fonte");

            var mezziCoinvolti = richiesta.MezziCoinvolti;

            Assert.That(mezziCoinvolti, Has.Count.EqualTo(1));
        }

        [Test]
        public void UnaRichiestaConUnMezzoPartitoRestituisceLoStatoInViaggio()
        {
            var richiesta = new RichiestaAssistenza();
            new ComposizionePartenze(richiesta, DateTime.Now, "fonte")
            {
                Componenti = new HashSet<ComponentePartenza>()
                {
                    new ComponentePartenza("XXX", "M1")
                }
            };
            new UscitaPartenza(richiesta, "M1", DateTime.Now, "fonte");

            var mezziCoinvolti = richiesta.MezziCoinvolti;
            var stato = mezziCoinvolti["M1"];

            Assert.That(stato, Is.InstanceOf<InViaggio>());
        }

        [Test]
        public void UnaRichiestaConUnMezzoSulPostoRestituisceLoStatoSulPosto()
        {
            var richiesta = new RichiestaAssistenza();
            new ComposizionePartenze(richiesta, DateTime.Now, "fonte")
            {
                Componenti = new HashSet<ComponentePartenza>()
                {
                    new ComponentePartenza("XXX", "M1")
                }
            };
            new UscitaPartenza(richiesta, "M1", DateTime.Now, "fonte");
            new ArrivoSulPosto(richiesta, "M1", DateTime.Now, "fonte");

            var mezziCoinvolti = richiesta.MezziCoinvolti;
            var stato = mezziCoinvolti["M1"];

            Assert.That(stato, Is.InstanceOf<SulPosto>());
        }

        [Test]
        public void UnaRichiestaConUnMezzoPartitoDalPostoRestituisceLoStatoInRientro()
        {
            var richiesta = new RichiestaAssistenza();
            new ComposizionePartenze(richiesta, DateTime.Now, "fonte")
            {
                Componenti = new HashSet<ComponentePartenza>()
                {
                    new ComponentePartenza("XXX", "M1")
                }
            };
            new UscitaPartenza(richiesta, "M1", DateTime.Now, "fonte");
            new ArrivoSulPosto(richiesta, "M1", DateTime.Now, "fonte");
            new PartenzaInRientro(richiesta, "M1", DateTime.Now, "fonte");

            var mezziCoinvolti = richiesta.MezziCoinvolti;
            var stato = mezziCoinvolti["M1"];

            Assert.That(stato, Is.InstanceOf<InRientro>());
        }

        [Test]
        public void UnaRichiestaConUnMezzoRientratoInSedeRestituisceLoStatoInSede()
        {
            var richiesta = new RichiestaAssistenza();
            new ComposizionePartenze(richiesta, DateTime.Now, "fonte")
            {
                Componenti = new HashSet<ComponentePartenza>()
                {
                    new ComponentePartenza("XXX", "M1")
                }
            };
            new UscitaPartenza(richiesta, "M1", DateTime.Now, "fonte");
            new ArrivoSulPosto(richiesta, "M1", DateTime.Now, "fonte");
            new PartenzaInRientro(richiesta, "M1", DateTime.Now, "fonte");
            new PartenzaRientrata(richiesta, "M1", DateTime.Now, "fonte");

            var mezziCoinvolti = richiesta.MezziCoinvolti;
            var stato = mezziCoinvolti["M1"];

            Assert.That(stato, Is.InstanceOf<InSede>());
        }
    }
}
