'use client';

import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Home, Mail, Sparkles, List, Shield, Clock3 } from 'lucide-react';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const title = searchParams.get('title');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_35%),linear-gradient(180deg,#eff6ff_0%,#ffffff_55%,#f8fafc_100%)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition">
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
          <Link href="/annonces" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 transition">
            <List className="w-4 h-4" />
            Voir les annonces
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr] items-start">
          <section className="relative overflow-hidden rounded-3xl border border-blue-100 bg-white/85 backdrop-blur-xl shadow-[0_24px_80px_-28px_rgba(15,23,42,0.28)] p-7 sm:p-10">
            <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-blue-200/40 blur-3xl" />
            <div className="absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-sky-200/40 blur-3xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                Annonce bien reçue
              </div>

              <h1 className="mt-5 text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                Votre annonce est en cours de vérification
              </h1>

              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                {title ? (
                  <>
                    <span className="font-semibold text-slate-800">{title}</span> a bien été transmise à notre équipe.
                  </>
                ) : (
                  <>Votre annonce a bien été transmise à notre équipe.</>
                )}
                {' '}Elle n'est pas encore publiée. Un administrateur va la relire et la valider manuellement avant sa mise en ligne.
              </p>

              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-xl bg-blue-600 p-2 text-white shadow-lg shadow-blue-600/20">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Email automatique dès approbation</p>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                      Dès que l'annonce sera approuvée, vous recevrez un email de confirmation avec le lien public de l'annonce et, si applicable, un lien sécurisé pour la modifier ou la supprimer.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800"
                >
                  <Home className="w-4 h-4" />
                  Retour à l'accueil
                </Link>
                <Link
                  href="/annonces"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-white px-5 py-3.5 text-sm font-semibold text-blue-800 shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <List className="w-4 h-4" />
                  Voir les annonces
                </Link>
              </div>
            </div>
          </section>

          <aside className="rounded-3xl border border-slate-200 bg-white shadow-lg p-6 sm:p-7">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Prochaines étapes
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex gap-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold">1</div>
                <div>
                  <p className="font-semibold text-slate-900">Révision manuelle</p>
                  <p className="text-sm text-slate-600">Notre équipe vérifie le contenu et la conformité de l'annonce.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold">2</div>
                <div>
                  <p className="font-semibold text-slate-900">Validation ou refus</p>
                  <p className="text-sm text-slate-600">Si elle est approuvée, elle sera mise en ligne automatiquement.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 font-bold">3</div>
                <div>
                  <p className="font-semibold text-slate-900">Email de confirmation</p>
                  <p className="text-sm text-slate-600">Vous serez informé dès la publication, avec tous les liens utiles.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-start gap-3">
              <Shield className="w-5 h-5 text-slate-600 mt-0.5" />
              <p className="text-sm text-slate-600 leading-relaxed">
                Le lien de gestion sécurisé n'est jamais affiché avant approbation, afin d'éviter toute confusion sur le statut de publication.
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <Clock3 className="w-4 h-4" />
              Validation généralement effectuée sous 24 heures.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function AnnouncementConfirmationPage() {
  return (
    <Suspense>
      <ConfirmationContent />
    </Suspense>
  );
}
