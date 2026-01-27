"""
Catalog Data for Structon
Contains categories, subcategories, and locale-specific labels.
"""

CATEGORIES = {
    'graafbakken': {
        'title': 'Graafbakken',
        'title_translations': {
            'be-nl': 'Graafbakken', 'nl-nl': 'Graafbakken',
            'be-fr': 'Godets de terrassement', 'de-de': 'Baggerschaufeln'
        },
        'description': 'Professionele graafbakken voor alle grondwerkzaamheden. Van standaard graafwerk tot gespecialiseerde toepassingen zoals drainage, rioleringen en funderingen.',
        'description_translations': {
            'be-nl': 'Professionele graafbakken voor alle grondwerkzaamheden. Van standaard graafwerk tot gespecialiseerde toepassingen zoals drainage, rioleringen en funderingen.',
            'nl-nl': 'Professionele graafbakken voor alle grondwerkzaamheden. Van standaard graafwerk tot gespecialiseerde toepassingen zoals drainage, rioleringen en funderingen.',
            'be-fr': 'Godets de terrassement professionnels pour tous les travaux de terrassement.',
            'de-de': 'Professionelle Baggerschaufeln für alle Erdarbeiten.'
        },
        'subcategories': ['slotenbakken', 'dieplepelbakken', 'sleuvenbakken', 'kantelbakken', 'rioolbakken', 'trapezium-bakken']
    },
    'sloop-sorteergrijpers': {
        'title': 'Sloop- & Sorteergrijpers',
        'title_translations': {
            'be-nl': 'Sloop- & Sorteergrijpers', 'nl-nl': 'Sloop- & Sorteergrijpers',
            'be-fr': 'Pinces de démolition et de tri', 'de-de': 'Abbruch- & Sortiergreifer'
        },
        'description': 'Robuuste sloop- en sorteergrijpers voor afbraak, recycling en materiaalverwerking.',
        'description_translations': {
            'be-nl': 'Robuuste sloop- en sorteergrijpers voor afbraak, recycling en materiaalverwerking.',
            'nl-nl': 'Robuuste sloop- en sorteergrijpers voor afbraak, recycling en materiaalverwerking.',
            'be-fr': 'Pinces de démolition et de tri robustes pour la démolition et le recyclage.',
            'de-de': 'Robuste Abbruch- und Sortiergreifer für Abriss und Recycling.'
        },
        'subcategories': ['sorteergrijpers', 'sloopgrijpers', 'puingrijpers']
    },
    'overige': {
        'title': 'Overige Aanbouwdelen',
        'title_translations': {
            'be-nl': 'Overige Aanbouwdelen', 'nl-nl': 'Overige Aanbouwdelen',
            'be-fr': 'Autres accessoires', 'de-de': 'Sonstige Anbaugeräte'
        },
        'description': 'Gespecialiseerde aanbouwdelen voor specifieke toepassingen.',
        'description_translations': {
            'be-nl': 'Gespecialiseerde aanbouwdelen voor specifieke toepassingen.',
            'nl-nl': 'Gespecialiseerde aanbouwdelen voor specifieke toepassingen.',
            'be-fr': 'Accessoires spécialisés pour des applications spécifiques.',
            'de-de': 'Spezialisierte Anbaugeräte für spezifische Anwendungen.'
        },
        'subcategories': ['ripper-tanden', 'hydraulische-hamers', 'egaliseerbalken', 'verdichtingsplaten']
    }
}

SUBCATEGORIES = {
    'slotenbakken': {
        'title': 'Slotenbakken', 'parent_category': 'graafbakken',
        'title_translations': {'be-nl': 'Slotenbakken', 'nl-nl': 'Slotenbakken', 'be-fr': 'Godets à tranchées', 'de-de': 'Grabenschaufeln'},
        'description': 'Slotenbakken zijn gespecialiseerde smalle graafbakken voor het graven van sleuven en leidingsloten.',
        'description_translations': {'be-nl': 'Slotenbakken zijn gespecialiseerde smalle graafbakken voor het graven van sleuven en leidingsloten.', 'nl-nl': 'Slotenbakken zijn gespecialiseerde smalle graafbakken voor het graven van sleuven en leidingsloten.', 'be-fr': 'Les godets à tranchées sont des godets étroits spécialisés.', 'de-de': 'Grabenschaufeln sind spezialisierte schmale Schaufeln.'}
    },
    'dieplepelbakken': {
        'title': 'Dieplepelbakken', 'parent_category': 'graafbakken',
        'title_translations': {'be-nl': 'Dieplepelbakken', 'nl-nl': 'Dieplepelbakken', 'be-fr': 'Godets profonds', 'de-de': 'Tiefschaufeln'},
        'description': 'Dieplepelbakken zijn extra diepe graafbakken voor vijvers, watergangen en diepe funderingen.',
        'description_translations': {'be-nl': 'Dieplepelbakken zijn extra diepe graafbakken voor vijvers, watergangen en diepe funderingen.', 'nl-nl': 'Dieplepelbakken zijn extra diepe graafbakken voor vijvers, watergangen en diepe funderingen.', 'be-fr': 'Les godets profonds sont des godets extra-profonds.', 'de-de': 'Tiefschaufeln sind extra tiefe Schaufeln.'}
    },
    'sleuvenbakken': {
        'title': 'Sleuvenbakken', 'parent_category': 'graafbakken',
        'title_translations': {'be-nl': 'Sleuvenbakken', 'nl-nl': 'Sleuvenbakken', 'be-fr': 'Godets à fentes', 'de-de': 'Schlitzschaufeln'},
        'description': 'Sleuvenbakken combineren smalle breedte met extra diepte voor diepe, smalle sleuven.',
        'description_translations': {'be-nl': 'Sleuvenbakken combineren smalle breedte met extra diepte voor diepe, smalle sleuven.', 'nl-nl': 'Sleuvenbakken combineren smalle breedte met extra diepte voor diepe, smalle sleuven.', 'be-fr': 'Les godets à fentes combinent une largeur étroite avec une profondeur supplémentaire.', 'de-de': 'Schlitzschaufeln kombinieren schmale Breite mit zusätzlicher Tiefe.'}
    },
    'kantelbakken': {
        'title': 'Kantelbakken', 'parent_category': 'graafbakken',
        'title_translations': {'be-nl': 'Kantelbakken', 'nl-nl': 'Kantelbakken', 'be-fr': 'Godets basculants', 'de-de': 'Schwenkschaufeln'},
        'description': 'Kantelbakken met hydraulisch kantelbare bak voor taluds en moeilijk bereikbare hoeken.',
        'description_translations': {'be-nl': 'Kantelbakken met hydraulisch kantelbare bak voor taluds en moeilijk bereikbare hoeken.', 'nl-nl': 'Kantelbakken met hydraulisch kantelbare bak voor taluds en moeilijk bereikbare hoeken.', 'be-fr': 'Les godets basculants disposent d\'un godet hydrauliquement inclinable.', 'de-de': 'Schwenkschaufeln verfügen über eine hydraulisch schwenkbare Schaufel.'}
    },
    'rioolbakken': {
        'title': 'Rioolbakken', 'parent_category': 'graafbakken',
        'title_translations': {'be-nl': 'Rioolbakken', 'nl-nl': 'Rioolbakken', 'be-fr': 'Godets à égouts', 'de-de': 'Kanalschaufeln'},
        'description': 'Rioolbakken met afgeronde bodem voor het graven van rioolsleuven.',
        'description_translations': {'be-nl': 'Rioolbakken met afgeronde bodem voor het graven van rioolsleuven.', 'nl-nl': 'Rioolbakken met afgeronde bodem voor het graven van rioolsleuven.', 'be-fr': 'Les godets à égouts sont des godets spécialement formés.', 'de-de': 'Kanalschaufeln sind speziell geformte Schaufeln.'}
    },
    'trapezium-bakken': {
        'title': 'Trapezium Bakken', 'parent_category': 'graafbakken',
        'title_translations': {'be-nl': 'Trapezium Bakken', 'nl-nl': 'Trapezium Bakken', 'be-fr': 'Godets trapézoïdaux', 'de-de': 'Trapezschaufeln'},
        'description': 'Trapezium bakken met trapeziumvormig profiel voor stabiele sleuven met schuine wanden.',
        'description_translations': {'be-nl': 'Trapezium bakken met trapeziumvormig profiel voor stabiele sleuven met schuine wanden.', 'nl-nl': 'Trapezium bakken met trapeziumvormig profiel voor stabiele sleuven met schuine wanden.', 'be-fr': 'Les godets trapézoïdaux ont un profil trapézoïdal.', 'de-de': 'Trapezschaufeln haben ein trapezförmiges Profil.'}
    },
    'sorteergrijpers': {
        'title': 'Sorteergrijpers', 'parent_category': 'sloop-sorteergrijpers',
        'title_translations': {'be-nl': 'Sorteergrijpers', 'nl-nl': 'Sorteergrijpers', 'be-fr': 'Pinces de tri', 'de-de': 'Sortiergreifer'},
        'description': 'Sorteergrijpers zijn hydraulische grijpers voor het sorteren van bouw- en sloopafval.',
        'description_translations': {'be-nl': 'Sorteergrijpers zijn hydraulische grijpers voor het sorteren van bouw- en sloopafval.', 'nl-nl': 'Sorteergrijpers zijn hydraulische grijpers voor het sorteren van bouw- en sloopafval.', 'be-fr': 'Les pinces de tri sont des pinces hydrauliques.', 'de-de': 'Sortiergreifer sind hydraulische Greifer.'}
    },
    'sloopgrijpers': {
        'title': 'Sloopgrijpers', 'parent_category': 'sloop-sorteergrijpers',
        'title_translations': {'be-nl': 'Sloopgrijpers', 'nl-nl': 'Sloopgrijpers', 'be-fr': 'Pinces de démolition', 'de-de': 'Abbruchgreifer'},
        'description': 'Sloopgrijpers zijn extra zware grijpers voor afbraakwerk.',
        'description_translations': {'be-nl': 'Sloopgrijpers zijn extra zware grijpers voor afbraakwerk.', 'nl-nl': 'Sloopgrijpers zijn extra zware grijpers voor afbraakwerk.', 'be-fr': 'Les pinces de démolition sont des pinces extra-lourdes.', 'de-de': 'Abbruchgreifer sind extra schwere Greifer.'}
    },
    'puingrijpers': {
        'title': 'Puingrijpers', 'parent_category': 'sloop-sorteergrijpers',
        'title_translations': {'be-nl': 'Puingrijpers', 'nl-nl': 'Puingrijpers', 'be-fr': 'Pinces à gravats', 'de-de': 'Schuttgreifer'},
        'description': 'Puingrijpers zijn veelzijdige grijpers voor het laden en sorteren van puin.',
        'description_translations': {'be-nl': 'Puingrijpers zijn veelzijdige grijpers voor het laden en sorteren van puin.', 'nl-nl': 'Puingrijpers zijn veelzijdige grijpers voor het laden en sorteren van puin.', 'be-fr': 'Les pinces à gravats sont des pinces polyvalentes.', 'de-de': 'Schuttgreifer sind vielseitige Greifer.'}
    },
    'ripper-tanden': {
        'title': 'Ripper Tanden', 'parent_category': 'overige',
        'title_translations': {'be-nl': 'Ripper Tanden', 'nl-nl': 'Ripper Tanden', 'be-fr': 'Dents de ripper', 'de-de': 'Reißzähne'},
        'description': 'Ripper tanden zijn krachtige breektanden voor verhardingen en rotsachtige bodems.',
        'description_translations': {'be-nl': 'Ripper tanden zijn krachtige breektanden voor verhardingen en rotsachtige bodems.', 'nl-nl': 'Ripper tanden zijn krachtige breektanden voor verhardingen en rotsachtige bodems.', 'be-fr': 'Les dents de ripper sont des dents de rupture puissantes.', 'de-de': 'Reißzähne sind kraftvolle Brechzähne.'}
    },
    'hydraulische-hamers': {
        'title': 'Hydraulische Hamers', 'parent_category': 'overige',
        'title_translations': {'be-nl': 'Hydraulische Hamers', 'nl-nl': 'Hydraulische Hamers', 'be-fr': 'Marteaux hydrauliques', 'de-de': 'Hydraulikhämmer'},
        'description': 'Hydraulische hamers zijn slagkrachtige breekhamers voor beton en asfalt.',
        'description_translations': {'be-nl': 'Hydraulische hamers zijn slagkrachtige breekhamers voor beton en asfalt.', 'nl-nl': 'Hydraulische hamers zijn slagkrachtige breekhamers voor beton en asfalt.', 'be-fr': 'Les marteaux hydrauliques sont des brise-roches puissants.', 'de-de': 'Hydraulikhämmer sind schlagkräftige Abbruchhämmer.'}
    },
    'egaliseerbalken': {
        'title': 'Egaliseerbalken', 'parent_category': 'overige',
        'title_translations': {'be-nl': 'Egaliseerbalken', 'nl-nl': 'Egaliseerbalken', 'be-fr': 'Poutres de nivellement', 'de-de': 'Planierbalken'},
        'description': 'Egaliseerbalken zijn precisie-afwerkingsgereedschap voor het egaliseren van terreinen.',
        'description_translations': {'be-nl': 'Egaliseerbalken zijn precisie-afwerkingsgereedschap voor het egaliseren van terreinen.', 'nl-nl': 'Egaliseerbalken zijn precisie-afwerkingsgereedschap voor het egaliseren van terreinen.', 'be-fr': 'Les poutres de nivellement sont des outils de finition de précision.', 'de-de': 'Planierbalken sind Präzisions-Endbearbeitungswerkzeuge.'}
    },
    'verdichtingsplaten': {
        'title': 'Verdichtingsplaten', 'parent_category': 'overige',
        'title_translations': {'be-nl': 'Verdichtingsplaten', 'nl-nl': 'Verdichtingsplaten', 'be-fr': 'Plaques de compactage', 'de-de': 'Verdichtungsplatten'},
        'description': 'Hydraulische verdichtingsplaten voor het verdichten van grond, zand en grind.',
        'description_translations': {'be-nl': 'Hydraulische verdichtingsplaten voor het verdichten van grond, zand en grind.', 'nl-nl': 'Hydraulische verdichtingsplaten voor het verdichten van grond, zand en grind.', 'be-fr': 'Plaques de compactage hydrauliques pour le compactage du sol.', 'de-de': 'Hydraulische Verdichtungsplatten zum Verdichten von Erde.'}
    }
}

LABELS = {
    'be-nl': {'home': 'Home', 'products': 'Producten', 'subcategories': 'Subcategorieën', 'products_found': 'producten gevonden', 'filters': 'Filters', 'clear': 'Wissen', 'brand': 'Merk', 'loading_brands': 'Merken laden...', 'volume': 'Inhoud (liter)', 'excavator_class': 'Graafmachine Klasse', 'width': 'Breedte (mm)', 'attachment': 'Ophanging', 'apply_filters': 'Filters Toepassen', 'sort': 'Sorteren:', 'newest': 'Nieuwste eerst', 'oldest': 'Oudste eerst', 'name_az': 'Naam A-Z', 'name_za': 'Naam Z-A', 'loading': 'Producten laden...', 'prev': 'Vorige', 'next': 'Volgende', 'meta_suffix': '| Structon'},
    'nl-nl': {'home': 'Home', 'products': 'Producten', 'subcategories': 'Subcategorieën', 'products_found': 'producten gevonden', 'filters': 'Filters', 'clear': 'Wissen', 'brand': 'Merk', 'loading_brands': 'Merken laden...', 'volume': 'Inhoud (liter)', 'excavator_class': 'Graafmachine Klasse', 'width': 'Breedte (mm)', 'attachment': 'Ophanging', 'apply_filters': 'Filters Toepassen', 'sort': 'Sorteren:', 'newest': 'Nieuwste eerst', 'oldest': 'Oudste eerst', 'name_az': 'Naam A-Z', 'name_za': 'Naam Z-A', 'loading': 'Producten laden...', 'prev': 'Vorige', 'next': 'Volgende', 'meta_suffix': '| Structon'},
    'be-fr': {'home': 'Accueil', 'products': 'Produits', 'subcategories': 'Sous-catégories', 'products_found': 'produits trouvés', 'filters': 'Filtres', 'clear': 'Effacer', 'brand': 'Marque', 'loading_brands': 'Chargement...', 'volume': 'Contenu (litres)', 'excavator_class': 'Classe d\'excavatrice', 'width': 'Largeur (mm)', 'attachment': 'Fixation', 'apply_filters': 'Appliquer', 'sort': 'Trier:', 'newest': 'Plus récent', 'oldest': 'Plus ancien', 'name_az': 'Nom A-Z', 'name_za': 'Nom Z-A', 'loading': 'Chargement...', 'prev': 'Précédent', 'next': 'Suivant', 'meta_suffix': '| Structon'},
    'de-de': {'home': 'Startseite', 'products': 'Produkte', 'subcategories': 'Unterkategorien', 'products_found': 'Produkte gefunden', 'filters': 'Filter', 'clear': 'Löschen', 'brand': 'Marke', 'loading_brands': 'Laden...', 'volume': 'Inhalt (Liter)', 'excavator_class': 'Baggerklasse', 'width': 'Breite (mm)', 'attachment': 'Aufhängung', 'apply_filters': 'Anwenden', 'sort': 'Sortieren:', 'newest': 'Neueste', 'oldest': 'Älteste', 'name_az': 'Name A-Z', 'name_za': 'Name Z-A', 'loading': 'Laden...', 'prev': 'Zurück', 'next': 'Weiter', 'meta_suffix': '| Structon'}
}
