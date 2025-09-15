import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalizationService
{
    // state
    _currentLanguageOption!: LanguageOption;
    _allLanguageOptionsByIds: { [key: string]: LanguageOption } = {};
    _currentTermsByKey: { [key: string]: string } = {};

    // config
    private _languagePreferenceIdKey = 'config-language-preference-id';

    _allLanguageOptions: LanguageOption[] =
        [
            {
                Id: 'pt-br',
                Name: 'Português',
                FlagIconName: 'brazil-flag-icon-01',
            },
            {
                Id: 'en-us',
                Name: 'English (US)',
                FlagIconName: 'usa-flag-icon-01',
            },
        ];

    _allTermsList: LocalizationTerm[] = [
        {
            TermKey: 'soon...',
            TermValueByLanguage:
            {
                'pt-br': 'Em breve...',
                'en-us': 'Soon...',
            }
        },
        {
            TermKey: 'Follow it on Twitter!',
            TermValueByLanguage:
            {
                'pt-br': 'Acompanhe no Twitter!',
                'en-us': 'Follow it on Twitter!',
            }
        },
        // home start
        {
            TermKey: 'home-see-on-pump-fun',
            TermValueByLanguage: {
                'pt-br': 'Ver no pump.fun',
                'en-us': 'See on pump.fun',
            }
        },
        {
            TermKey: 'home-add-to-phantom',
            TermValueByLanguage: {
                'pt-br': 'Adicionar à Phantom',
                'en-us': 'Add to Phantom',
            }
        },
        {
            TermKey: 'home-add-to-metamask',
            TermValueByLanguage: {
                'pt-br': 'Adicionar à MetaMask',
                'en-us': 'Add to MetaMask',
            }
        },
        {
            TermKey: 'home-caution-with-scams-fake-profiles-contracts-links',
            TermValueByLanguage: {
                'pt-br': 'Cuidado com scams, perfis, contratos e links falsos, sempre busque por links oficiais!',
                'en-us': 'Be careful with scams, fake profiles, contracts, and links, always look for official links!',
            }
        },

        // home roadmap
        {
            TermKey: 'home-roadmap-title',
            TermValueByLanguage: {
                'pt-br': 'Roadmap',
                'en-us': 'Roadmap',
            }
        },
        {
            TermKey: 'home-where-and-when-will-BASE-ANGULAR-PROJECT-01-pass',
            TermValueByLanguage: {
                'pt-br': 'Aonde a $BASE-ANGULAR-PROJECT-01 vai passar e quando',
                'en-us': 'Where and when will $BASE-ANGULAR-PROJECT-01 pass',
            }
        },
        {
            TermKey: 'home-december-2024',
            TermValueByLanguage: {
                'pt-br': 'Dezembro/2024',
                'en-us': 'December/2024',
            }
        },
        {
            TermKey: 'home-website-launch',
            TermValueByLanguage: {
                'pt-br': '- Lançamento do WebSite',
                'en-us': '- Website Launch',
            }
        },
        {
            TermKey: 'home-twitter-launch',
            TermValueByLanguage: {
                'pt-br': '- Lançamento do Twitter',
                'en-us': '- Twitter Launch',
            }
        },
        {
            TermKey: 'home-token-launch',
            TermValueByLanguage: {
                'pt-br': '- Lançamento do Token',
                'en-us': '- Token Launch',
            }
        },
        {
            TermKey: 'home-first-quarter-2025',
            TermValueByLanguage: {
                'pt-br': '1º Trimestre 2025',
                'en-us': '1st Quarter 2025',
            }
        },
        {
            TermKey: 'home-telegram-group',
            TermValueByLanguage: {
                'pt-br': '- Grupo no Telegram',
                'en-us': '- Telegram Group',
            }
        },
        {
            TermKey: 'home-discord-server',
            TermValueByLanguage: {
                'pt-br': '- Servidor no Discord',
                'en-us': '- Discord Server',
            }
        },
        {
            TermKey: 'home-second-quarter-2025',
            TermValueByLanguage: {
                'pt-br': '2º Trimestre 2025',
                'en-us': '2nd Quarter 2025',
            }
        },
        {
            TermKey: 'home-blackjack-game',
            TermValueByLanguage: {
                'pt-br': '- Blackjack (jogo)',
                'en-us': '- Blackjack (game)',
            }
        },
        {
            TermKey: 'home-blackjack-21-against-players-or-table',
            TermValueByLanguage: {
                'pt-br': 'Blackjack (21) contra outros jogadores ou contra a mesa. Os jogadores poderão jogar sem ter que deixar a $BASE-ANGULAR-PROJECT-01 depositada em qualquer outro lugar que não seja a própria wallet',
                'en-us': 'Blackjack (21) against other players or the table. Players will be able to play without having to leave their $BASE-ANGULAR-PROJECT-01 deposited anywhere other than their own wallet',
            }
        },
        {
            TermKey: 'home-third-quarter-2025',
            TermValueByLanguage: {
                'pt-br': '3º Trimestre 2025',
                'en-us': '3rd Quarter 2025',
            }
        },
        {
            TermKey: 'home-roadmap-review',
            TermValueByLanguage: {
                'pt-br': '- Revisão do Roadmap',
                'en-us': '- Roadmap Review',
            }
        },
        {
            TermKey: 'home-roadmap-review-validation',
            TermValueByLanguage: {
                'pt-br': 'Revisão para validar o conteúdo do Roadmap e se alguma coisa pode/precisa ser adiantada/adiada baseado no progresso atual e no estado do projeto',
                'en-us': 'Review to validate the content of the Roadmap and if anything can/needs to be brought forward/postponed based on the current progress and project status',
            }
        },
        {
            TermKey: 'home-poker-game',
            TermValueByLanguage: {
                'pt-br': '- Poker (jogo)',
                'en-us': '- Poker (game)',
            }
        },
        {
            TermKey: 'home-poker-texas-holdem-against-players',
            TermValueByLanguage: {
                'pt-br': 'Poker (Texas Hold\'em) contra outros jogadores. Os jogadores poderão jogar sem ter que deixar a $BASE-ANGULAR-PROJECT-01 depositada em qualquer outro lugar que não seja a própria wallet',
                'en-us': 'Poker (Texas Hold\'em) against other players. Players will be able to play without having to leave their $BASE-ANGULAR-PROJECT-01 deposited anywhere other than their own wallet',
            }
        },
        {
            TermKey: 'home-fourth-quarter-2025',
            TermValueByLanguage: {
                'pt-br': '4º Trimestre 2025',
                'en-us': '4th Quarter 2025',
            }
        },
        {
            TermKey: 'home-project-p',
            TermValueByLanguage: {
                'pt-br': '- "Projeto P"',
                'en-us': '- "Project P"',
            }
        },
        {
            TermKey: 'home-game-with-own-token-nfts-staking',
            TermValueByLanguage: {
                'pt-br': 'Jogo com token próprio, 2 coleções de NFT\'s e staking (e talvez PVP), baseado em um jogo antigo muito conhecido. Primeira rodada de venda do token vai ser feita apenas em $BASE-ANGULAR-PROJECT-01',
                'en-us': 'Game with its own token, 2 NFT collections, and staking (and maybe PVP), based on a very well-known old game. The first round of the token sale will be made only in $BASE-ANGULAR-PROJECT-01'
            }
        },
        {
            TermKey: 'home-roadmap-content-review',
            TermValueByLanguage: {
                'pt-br': 'Revisão do conteúdo do Roadmap',
                'en-us': 'Roadmap Content Review',
            }
        },


        // home about
        {
            TermKey: 'home-about-title',
            TermValueByLanguage: {
                'pt-br': 'Sobre',
                'en-us': 'About',
            }
        },
        {
            TermKey: 'home-pichanha-coin-history',
            TermValueByLanguage: {
                'pt-br': 'A história da Pichanha Coin ($BASE-ANGULAR-PROJECT-01)',
                'en-us': 'The history of Pichanha Coin ($BASE-ANGULAR-PROJECT-01)',
            }
        },
        {
            TermKey: 'home-origin-title',
            TermValueByLanguage: {
                'pt-br': 'Origem',
                'en-us': 'Origin',
            }
        },
        {
            TermKey: 'home-brazil-2022-election-history',
            TermValueByLanguage: {
                'pt-br': 'No Brasil, as eleições para presidência de 2022 foram muito marcantes por terem sido extremamente polarizadas. Durante o período de candidatura, "Lula", um dos ex-presidentes, disse que se ele fosse eleito, as pessoas pobres iam poder comer BASE-ANGULAR-PROJECT-01 (um corte nobre de boi)',
                'en-us': 'In Brazil, the 2022 presidential election was very memorable for being extremely polarized. During the candidacy period, "Lula", one of the former presidents, said that if he were elected, poor people would be able to eat BASE-ANGULAR-PROJECT-01 (a noble cut of beef)',
            }
        },
        {
            TermKey: 'home-candidate-elected',
            TermValueByLanguage: {
                'pt-br': 'Esse candidato foi eleito',
                'en-us': 'This candidate was elected',
            }
        },
        {
            TermKey: 'home-BASE-ANGULAR-PROJECT-01-de-lula-meme',
            TermValueByLanguage: {
                'pt-br': 'Mesmo hoje, muito tempo depois das eleições, a polarização política continua. E desde então, a "BASE-ANGULAR-PROJECT-01 de Lula" foi e continua sendo um meme muito forte e reconhecido no Brasil, principalmente em discussões de política e usada em discursos de opositores',
                'en-us': 'Even today, long after the elections, political polarization continues. And since then, "Lula\'s BASE-ANGULAR-PROJECT-01" has been and continues to be a very strong and recognized meme in Brazil, especially in political discussions and used in speeches by opponents',
            }
        },
        {
            TermKey: 'home-double-meaning',
            TermValueByLanguage: {
                'pt-br': 'Duplo sentido',
                'en-us': 'Double meaning',
            }
        },
        {
            TermKey: 'home-BASE-ANGULAR-PROJECT-01-symbol-meaning',
            TermValueByLanguage: {
                'pt-br': 'O símbolo da BASE-ANGULAR-PROJECT-01 é $BASE-ANGULAR-PROJECT-01, em português, "BASE-ANGULAR-PROJECT-01" é uma gíria para BASE-ANGULAR-PROJECT-01',
                'en-us': 'The symbol of BASE-ANGULAR-PROJECT-01 is $BASE-ANGULAR-PROJECT-01, in Portuguese, "BASE-ANGULAR-PROJECT-01" is a slang for BASE-ANGULAR-PROJECT-01',
            }
        },
        {
            TermKey: 'home-avoid-hands-on-your-BASE-ANGULAR-PROJECT-01s',
            TermValueByLanguage: {
                'pt-br': 'Evite que alguém passe a mão nas suas $BASE-ANGULAR-PROJECT-01s',
                'en-us': 'Avoid someone getting their hands on your $BASE-ANGULAR-PROJECT-01s'
            }
        },
        {
            TermKey: 'home-caution-with-scams-profiles-contracts-fakes',
            TermValueByLanguage: {
                'pt-br': 'Cuidado com scams, <b>perfís</b>, <b>contratos</b> e <b>falsos</b>, sempre busque por links oficiais! Não confie em nenhum <b>site</b>/<b>pessoa</b> que peça sua <b>"seed phrase"</b>, <b>"private key"</b> nem assinar algum contrato que não esteja <b>listado em canais oficiais</b>',
                'en-us': 'Be careful with scams, <b>profiles</b>, <b>contracts</b> and <b>fakes</b>, always look for official links! Do not trust any <b>site</b>/<b>person</b> that asks for your <b>"seed phrase"</b>, <b>"private key"</b> or to sign a contract that is not <b>listed in official channels</b>',
            }
        },
        {
            TermKey: 'home-official-contracts',
            TermValueByLanguage: {
                'pt-br': 'Contratos oficiais',
                'en-us': 'Official contracts',
            }
        },
        {
            TermKey: 'home-BASE-ANGULAR-PROJECT-01',
            TermValueByLanguage: {
                'pt-br': 'BASE-ANGULAR-PROJECT-01 ($BASE-ANGULAR-PROJECT-01):',
                'en-us': 'BASE-ANGULAR-PROJECT-01 ($BASE-ANGULAR-PROJECT-01):',
            }
        },




        // home security
        {
            TermKey: 'home-security-title',
            TermValueByLanguage: {
                'pt-br': 'Segurança',
                'en-us': 'Security'
            }
        },


        // home about the team
        {
            TermKey: 'home-about-the-team-title',
            TermValueByLanguage: {
                'pt-br': 'Sobre o Time',
                'en-us': 'About the Team',
            }
        },
        {
            TermKey: 'home-who-conceived-BASE-ANGULAR-PROJECT-01-title',
            TermValueByLanguage: {
                'pt-br': 'Quem pensou na $BASE-ANGULAR-PROJECT-01',
                'en-us': 'Who conceived $BASE-ANGULAR-PROJECT-01',
            }
        },
        {
            TermKey: 'home-one-developer',
            TermValueByLanguage: {
                'pt-br': '1 dev',
                'en-us': '1 dev',
            }
        },
        {
            TermKey: 'home-team-is-one-dev',
            TermValueByLanguage: {
                'pt-br': 'Por enquanto, "o time" é apenas 1 dev',
                'en-us': 'For now, "the team" is just 1 dev',
            }
        },
        {
            TermKey: 'home-about-the-1',
            TermValueByLanguage: {
                'pt-br': 'Sobre o 1',
                'en-us': 'About the 1'
            }
        },
        {
            TermKey: 'home-3d-artist-gamedev-cs-player-hardware-nerd',
            TermValueByLanguage: {
                'pt-br': 'Artista 3D, game-dev, jogador de Counter-Strike e nerd de hardware',
                'en-us': '3D artist, game dev, Counter-Strike player, and hardware nerd',
            }
        },
        {
            TermKey: 'home-tech-enthusiast-programmer-crypto-gaming-loss',
            TermValueByLanguage: {
                'pt-br': 'Sou um entusiasta de tecnologia, programador e já perdi alguns milhares de Reais em 2022 jogando jogos crypto de qualidade questionável e bastante da falta de transparência',
                'en-us': 'I am a technology enthusiast, programmer, and I lost several thousand Reais in 2022 playing crypto games of questionable quality and lacking transparency',
            }
        },
        {
            TermKey: 'home-my-goal-transparency',
            TermValueByLanguage: {
                'pt-br': 'Meu objetivo é tentar fazer diferente, sempre focando na maior transparência possível e no bom senso',
                'en-us': 'My goal is to try to do things differently, always focusing on the highest possible transparency and common sense'
            }
        },
        {
            TermKey: 'home-anonymity-title',
            TermValueByLanguage: {
                'pt-br': 'Anonimato',
                'en-us': 'Anonymity',
            }
        },
        {
            TermKey: 'home-prefer-not-anonymous-but-didnt-calculate-implications',
            TermValueByLanguage: {
                'pt-br': 'Preferiria não estar anônimo parecendo um scamzão, mas eu não calculei as implicações (boas e ruins) de me identificar, então vou me manter assim por ora',
                'en-us': 'I would prefer not to be anonymous, looking like a scam, but I didn’t calculate the implications (good and bad) of identifying myself, so I will remain like this for now',
            }
        },
        {
            TermKey: 'home-medium-long-term',
            TermValueByLanguage: {
                'pt-br': 'Médio/Longo prazo',
                'en-us': 'Medium/Long term',
            }
        },
        {
            TermKey: 'home-no-pump-and-dump-no-rug-pull-long-term-goals',
            TermValueByLanguage: {
                'pt-br': 'Não pretendo fazer pump and dump nem ruggar, nem tenho dinheiro pra isso. Independente desse projeto dar certo ou não, minha meta é o médio/longo prazo e poder financiar os meus próximos projetos maiores',
                'en-us': 'I do not intend to pump and dump or rug pull, nor do I have money for that. Regardless of whether this project succeeds or not, my goal is the medium/long term and to be able to fund my next bigger projects',
            }
        },
        {
            TermKey: 'home-hope-not-to-become-what-im-trying-to-destroy',
            TermValueByLanguage: {
                'pt-br': '~Espero não me tornar o que eu estou tentando destruir',
                'en-us': '~I hope not to become what I am trying to destroy',
            }
        },


    ]

    constructor()
    {
        this.SetInitialState();
    }

    SetInitialState = () =>
    {
        this._allLanguageOptionsByIds = {};
        this._allLanguageOptions.map(
            (languageOption) =>
            {
                if (!(languageOption.Id in this._allLanguageOptionsByIds))
                    this._allLanguageOptionsByIds[languageOption.Id] = languageOption;
                else
                    console.log('Duplicated languageOption.Id! languageOption = ', languageOption);
            })

        this.RefreshTermsValues();
    }

    RefreshTermsValues = () =>
    {
        this._currentTermsByKey = {};
        this._currentLanguageOption = this.GetCurrentLanguageOptionCache();

        let languageId = this._currentLanguageOption.Id;

        this._allTermsList.map(
            (term) =>
            {
                let termKey = term.TermKey;
                let currentLanguageTermValue = termKey;

                if (!(termKey in this._currentTermsByKey))
                {
                    if (languageId in term.TermValueByLanguage)
                        currentLanguageTermValue = term.TermValueByLanguage[languageId];
                    else
                    {
                        console.error(
                            'languageId not in term.TermValueByLanguage!' + '\n' +
                            'languageId = ', languageId, '\n',
                            'term = ', term, '\n',
                            '')

                        let allValues = Object.values(term.TermValueByLanguage);

                        if (allValues.length > 0)
                            currentLanguageTermValue = allValues[0];
                    }

                    this._currentTermsByKey[termKey] = currentLanguageTermValue;
                }
                else
                    console.error('Duplicated termKey! termKey = ', termKey);
            });
    }

    GetCurrentLanguageOptionCache = () =>
    {
        let value!: LanguageOption;

        let languagePreferenceId = localStorage.getItem(this._languagePreferenceIdKey);

        // console.log('languagePreferenceId = ', languagePreferenceId);

        if (!languagePreferenceId)
            languagePreferenceId = this._allLanguageOptions[0].Id;

        value = this._allLanguageOptionsByIds[languagePreferenceId];

        if (!value)
            value = this._allLanguageOptions[0];

        return value;
    }

    SetCurrentLanguage = (languageId: string) =>
    {
        localStorage.setItem(this._languagePreferenceIdKey, languageId);

        this.RefreshTermsValues();
    }
}

export interface LanguageOption
{
    Id: string,
    Name: string,
    FlagIconName: string,
}

export interface LocalizationTerm
{
    TermKey: string,
    TermValueByLanguage: { [key: string]: string },
}
