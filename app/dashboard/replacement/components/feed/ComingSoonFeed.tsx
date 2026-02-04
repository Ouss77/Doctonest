"use client"

import { useState } from "react"
import { Bell, Heart, MessageCircle, Share2, Bookmark, MoreVertical, Sparkles, Target, Zap, UsersIcon, TrendingUp } from "lucide-react"

export default function ComingSoonFeed() {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [likes, setLikes] = useState(89)
  const [comments, setComments] = useState(16)

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1)
    } else {
      setLikes(likes + 1)
    }
    setLiked(!liked)
  }

  const handleBookmark = () => {
    setBookmarked(!bookmarked)
  }

  return (
    <div className="space-y-6">
      {/* Bannière d'annonce élégante */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="relative p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Nouveau fil d'actualités en préparation</h2>
                <p className="text-blue-100">
                  Connectez-vous avec la communauté médicale comme jamais auparavant
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                <span className="text-white text-sm font-medium">Prochainement</span>
              </div>
              <button 
                onClick={() => alert("Vous serez notifié dès que le fil d'actualités sera disponible !")}
                className="px-4 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
              >
                Être notifié
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Zone de création de post */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
            Dr.
          </div>
          <div className="flex-1">
            <button 
              onClick={() => {
                const message = "Bientôt, vous pourrez partager vos expériences, poser des questions et échanger avec vos collègues médecins !";
                alert(message);
              }}
              className="w-full p-4 text-left border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 rounded-xl transition-all duration-200"
            >
              <div className="text-gray-500 font-medium">Commencer une publication...</div>
              <div className="text-sm text-gray-400 mt-1">Partagez une expérience, une question ou une opportunité</div>
            </button>
          </div>
        </div>

      </div>

      {/* Post principal d'annonce */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        {/* En-tête du post */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  <Target className="w-8 h-8" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-3 border-white flex items-center justify-center shadow-sm">
                  <Zap className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-gray-900 text-lg">DoctoNest Médecins</h3>
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-semibold rounded-full">
                    Communauté
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    3h • 
                  </span>
                  <span>👥 Communauté Médicale</span>
                </div>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenu du post */}
        <div className="p-5">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
              🩺 Rejoignez la révolution du réseau médical sur DoctoNest
            </h1>
            
            <div className="prose prose-lg max-w-none text-gray-700 mb-6">
              <p className="mb-4">
                Chers médecins et professionnels de santé, nous sommes ravis de vous annoncer une nouvelle ère de connectivité !
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-5 rounded-r-lg my-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-blue-800 font-medium mb-2">Pour vous, médecins :</p>
                    <ul className="space-y-2 text-blue-700">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Échangez vos expériences cliniques
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Trouvez des missions correspondant à votre spécialité
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Collaborez avec vos pairs sur des cas complexes
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <p className="mb-4">
                Notre futur fil d'actualités vous permettra de <span className="font-semibold text-blue-600">créer un réseau professionnel solide</span>, 
                <span className="font-semibold text-blue-600"> partager vos connaissances</span> et <span className="font-semibold text-blue-600">trouver des opportunités</span> 
                qui correspondent à votre expertise et vos disponibilités.
              </p>
            </div>
          </div>

          {/* Visualisation de la progression */}
          <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Développement en cours</h4>
                <p className="text-sm text-gray-600">Nous travaillons pour offrir la meilleure expérience aux médecins</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">82%</div>
                <div className="text-xs text-gray-500">Complété</div>
              </div>
            </div>
            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: '82%' }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Conception</span>
              <span>Développement</span>
              <span>Tests</span>
              <span>Lancement</span>
            </div>
          </div>

          {/* Galerie de fonctionnalités */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { 
                icon: UsersIcon, 
                color: "from-blue-500 to-cyan-500",
                title: "Réseau Professionnel", 
                desc: "Connectez-vous avec des médecins de votre spécialité"
              },
              { 
                icon: Bell, 
                color: "from-purple-500 to-pink-500",
                title: "Alertes Missions", 
                desc: "Recevez des opportunités adaptées à votre profil"
              },
              { 
                icon: TrendingUp, 
                color: "from-green-500 to-emerald-500",
                title: "Développement", 
                desc: "Améliorez vos compétences grâce aux échanges"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5 hover:border-blue-200 transition-colors">
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h5 className="font-semibold text-gray-900 mb-2">{feature.title}</h5>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats d'engagement */}
          <div className="flex items-center justify-between text-sm text-gray-500 py-4 border-t border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {[
                  "bg-gradient-to-r from-red-400 to-pink-400",
                  "bg-gradient-to-r from-yellow-400 to-orange-400", 
                  "bg-gradient-to-r from-green-400 to-teal-400",
                  "bg-gradient-to-r from-blue-400 to-indigo-400"
                ].map((gradient, i) => (
                  <div 
                    key={i}
                    className={`w-8 h-8 ${gradient} rounded-full border-2 border-white shadow-sm`}
                  ></div>
                ))}
              </div>
              <div>
                <span className="font-medium text-gray-700">{likes} médecins</span>
                <span className="text-gray-500"> et </span>
                <span className="font-medium text-gray-700">{comments} autres</span>
                <span className="text-gray-500"> ont réagi</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span>{comments} commentaires</span>
              <span>•</span>
              <span>28 partages</span>
            </div>
          </div>

          {/* Actions d'interaction */}
          <div className="grid grid-cols-4 gap-2 py-3">
            <button 
              onClick={handleLike}
              className={`flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-all ${liked ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-red-600' : ''}`} />
              <span className="font-medium">J'aime</span>
              {liked && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">✓</span>}
            </button>
            <button className="flex items-center justify-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Commenter</span>
            </button>
            <button className="flex items-center justify-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors">
              <Share2 className="w-5 h-5" />
              <span className="font-medium">Partager</span>
            </button>
            <button 
              onClick={handleBookmark}
              className={`flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-all ${bookmarked ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-blue-600' : ''}`} />
              <span className="font-medium">Enregistrer</span>
            </button>
          </div>
        </div>

        {/* Section commentaires */}
        <div className="p-5 bg-gray-50 border-t border-gray-100">
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Commentaires ({comments})</h4>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm text-gray-500 bg-white border border-gray-200 rounded-xl p-3">
                  <span className="font-medium text-gray-700">Dr. Sophie Martin</span> : "Enfin une plateforme qui comprend les besoins des médecins !"
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-300 to-blue-400 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm text-gray-500 bg-white border border-gray-200 rounded-xl p-3">
                  <span className="font-medium text-gray-700">Dr. Ahmed Benali</span> : "Parfait pour échanger sur des cas cliniques avec des confrères."
                </div>
              </div>
            </div>
          </div>
          <div className="text-center py-4">
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Voir tous les commentaires →
            </button>
          </div>
        </div>
      </div>

      {/* Posts suggestions */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>

      {/* Footer de feed */}
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-3 text-gray-500">
          <div className="h-px w-20 bg-gray-200"></div>
          <span className="text-sm">Plus de contenu médical à venir bientôt</span>
          <div className="h-px w-20 bg-gray-200"></div>
        </div>
      </div>
    </div>
  )
}
