CREATE DATABASE BiblioDB;
USE BiblioDB;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user'
);

CREATE TABLE genres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);
CREATE TABLE stories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  genre_id INT,
  image VARCHAR(500),
  content LONGTEXT,
  FOREIGN KEY (genre_id) REFERENCES genres(id)
);
CREATE TABLE favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    story_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_fav (user_id, story_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
);

ALTER TABLE users ADD COLUMN avatar VARCHAR(255) DEFAULT NULL;
ALTER TABLE users ADD COLUMN gender VARCHAR(20) DEFAULT 'Non précisé';
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    story_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO genres (name) VALUES
('Aventure'),
('Fantastique'),
('Romance'),
('Mystère'),
('Horreur'),
('Science Fiction');

INSERT INTO stories (title, genre_id, image, content) VALUES
(
  'Le Trésor Perdu',
  1,
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
  'La connaissance des faits historiques est assurée par la tradition orale. Selon Georges Lefebvre, « les premiers historiens, en ce sens, furent probablement des poètes ». Selon Michel de Certeau : « De même, chez les Merina de Madagascar, les teiarana (anciennes listes généalogiques), puis les tantara (l''histoire passée) forment un héritage des oreilles (lovantsofina) ou une mémoire de la bouche (tadidivava) ». Avec l''invention de l''écriture apparaît le récit historique, production spontanée et indépendante des contraintes postérieures de la discipline historique. Les premières chroniques mésopotamiennes remontent au début du IIIe millénaire av. J.-C et se dégagent de toute influence mythologique à partir du début du millénaire suivant. Il s''agit de renseignements utiles aux dynasties, de listes décrivant année par année les événements d''un règne (celui d''Hammurabi), d''un État (Mari), voire, dans le cas de la chronique synchronique, de plusieurs États (la Babylonie et l''Assyrie). La vocation de ces listes est purement mémorielle et didactique et elles ne sont pas exemptes d''un certain parti pris : il s''agit de faire connaître à la postérité sous un jour positif les faits et gestes de son souverain. Ainsi, le Cylindre de Cyrus glorifie Cyrus le Grand comme un bienfaiteur des citoyens de Babylone qui a amélioré leurs vies, rapatrié les personnes déplacées, restauré les temples et lieux de culte à travers la Mésopotamie et dans la région. L''histoire en Grèce antique ajoute à ces motivations des préoccupations d''ordre littéraire et scientifique comme en témoignent les œuvres d''Hérodote, de Thucydide et de Polybe. Hérodote, considéré comme le père de l''histoire, souhaite préserver la mémoire des actions humaines afin que le temps n''abolisse pas les travaux des hommes. Thucydide introduit une méthode rigoureuse fondée sur la recherche de la vérité historique et une vision rationnelle des faits, excluant l''intervention des dieux au profit des actions humaines. Polybe poursuit cette tradition avec une histoire universelle pragmatique, fondée sur l''enquête, l''observation directe et l''analyse des causes, annonçant les grandes synthèses historiques modernes.'
),
(
  'Le Royaume des Ombres',
  2,
  'https://images.unsplash.com/photo-1528459105426-b9548367069b',
  'La connaissance des faits historiques est assurée par la tradition orale. Selon Georges Lefebvre, « les premiers historiens, en ce sens, furent probablement des poètes ». Selon Michel de Certeau : « De même, chez les Merina de Madagascar, les teiarana (anciennes listes généalogiques), puis les tantara (l''histoire passée) forment un héritage des oreilles (lovantsofina) ou une mémoire de la bouche (tadidivava) ». Avec l''invention de l''écriture apparaît le récit historique, production spontanée et indépendante des contraintes postérieures de la discipline historique. Les premières chroniques mésopotamiennes remontent au début du IIIe millénaire av. J.-C et se dégagent de toute influence mythologique à partir du début du millénaire suivant. Il s''agit de renseignements utiles aux dynasties, de listes décrivant année par année les événements d''un règne (celui d''Hammurabi), d''un État (Mari), voire, dans le cas de la chronique synchronique, de plusieurs États (la Babylonie et l''Assyrie). La vocation de ces listes est purement mémorielle et didactique et elles ne sont pas exemptes d''un certain parti pris : il s''agit de faire connaître à la postérité sous un jour positif les faits et gestes de son souverain. Ainsi, le Cylindre de Cyrus glorifie Cyrus le Grand comme un bienfaiteur des citoyens de Babylone qui a amélioré leurs vies, rapatrié les personnes déplacées, restauré les temples et lieux de culte à travers la Mésopotamie et dans la région. L''histoire en Grèce antique ajoute à ces motivations des préoccupations d''ordre littéraire et scientifique comme en témoignent les œuvres d''Hérodote, de Thucydide et de Polybe. Hérodote, considéré comme le père de l''histoire, souhaite préserver la mémoire des actions humaines afin que le temps n''abolisse pas les travaux des hommes. Thucydide introduit une méthode rigoureuse fondée sur la recherche de la vérité historique et une vision rationnelle des faits, excluant l''intervention des dieux au profit des actions humaines. Polybe poursuit cette tradition avec une histoire universelle pragmatique, fondée sur l''enquête, l''observation directe et l''analyse des causes, annonçant les grandes synthèses historiques modernes.'
),
(
  'Amour au Clair de Lune',
  3,
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
  'La connaissance des faits historiques est assurée par la tradition orale. Selon Georges Lefebvre, « les premiers historiens, en ce sens, furent probablement des poètes ». Selon Michel de Certeau : « De même, chez les Merina de Madagascar, les teiarana (anciennes listes généalogiques), puis les tantara (l''histoire passée) forment un héritage des oreilles (lovantsofina) ou une mémoire de la bouche (tadidivava) ». Avec l''invention de l''écriture apparaît le récit historique, production spontanée et indépendante des contraintes postérieures de la discipline historique. Les premières chroniques mésopotamiennes remontent au début du IIIe millénaire av. J.-C et se dégagent de toute influence mythologique à partir du début du millénaire suivant. Il s''agit de renseignements utiles aux dynasties, de listes décrivant année par année les événements d''un règne (celui d''Hammurabi), d''un État (Mari), voire, dans le cas de la chronique synchronique, de plusieurs États (la Babylonie et l''Assyrie). La vocation de ces listes est purement mémorielle et didactique et elles ne sont pas exemptes d''un certain parti pris : il s''agit de faire connaître à la postérité sous un jour positif les faits et gestes de son souverain. Ainsi, le Cylindre de Cyrus glorifie Cyrus le Grand comme un bienfaiteur des citoyens de Babylone qui a amélioré leurs vies, rapatrié les personnes déplacées, restauré les temples et lieux de culte à travers la Mésopotamie et dans la région. L''histoire en Grèce antique ajoute à ces motivations des préoccupations d''ordre littéraire et scientifique comme en témoignent les œuvres d''Hérodote, de Thucydide et de Polybe. Hérodote, considéré comme le père de l''histoire, souhaite préserver la mémoire des actions humaines afin que le temps n''abolisse pas les travaux des hommes. Thucydide introduit une méthode rigoureuse fondée sur la recherche de la vérité historique et une vision rationnelle des faits, excluant l''intervention des dieux au profit des actions humaines. Polybe poursuit cette tradition avec une histoire universelle pragmatique, fondée sur l''enquête, l''observation directe et l''analyse des causes, annonçant les grandes synthèses historiques modernes.'
),
(
  'Le Secret de la Chambre 7',
  4,
  'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d',
  'La connaissance des faits historiques est assurée par la tradition orale. Selon Georges Lefebvre, « les premiers historiens, en ce sens, furent probablement des poètes ». Selon Michel de Certeau : « De même, chez les Merina de Madagascar, les teiarana (anciennes listes généalogiques), puis les tantara (l''histoire passée) forment un héritage des oreilles (lovantsofina) ou une mémoire de la bouche (tadidivava) ». Avec l''invention de l''écriture apparaît le récit historique, production spontanée et indépendante des contraintes postérieures de la discipline historique. Les premières chroniques mésopotamiennes remontent au début du IIIe millénaire av. J.-C et se dégagent de toute influence mythologique à partir du début du millénaire suivant. Il s''agit de renseignements utiles aux dynasties, de listes décrivant année par année les événements d''un règne (celui d''Hammurabi), d''un État (Mari), voire, dans le cas de la chronique synchronique, de plusieurs États (la Babylonie et l''Assyrie). La vocation de ces listes est purement mémorielle et didactique et elles ne sont pas exemptes d''un certain parti pris : il s''agit de faire connaître à la postérité sous un jour positif les faits et gestes de son souverain. Ainsi, le Cylindre de Cyrus glorifie Cyrus le Grand comme un bienfaiteur des citoyens de Babylone qui a amélioré leurs vies, rapatrié les personnes déplacées, restauré les temples et lieux de culte à travers la Mésopotamie et dans la région. L''histoire en Grèce antique ajoute à ces motivations des préoccupations d''ordre littéraire et scientifique comme en témoignent les œuvres d''Hérodote, de Thucydide et de Polybe. Hérodote, considéré comme le père de l''histoire, souhaite préserver la mémoire des actions humaines afin que le temps n''abolisse pas les travaux des hommes. Thucydide introduit une méthode rigoureuse fondée sur la recherche de la vérité historique et une vision rationnelle des faits, excluant l''intervention des dieux au profit des actions humaines. Polybe poursuit cette tradition avec une histoire universelle pragmatique, fondée sur l''enquête, l''observation directe et l''analyse des causes, annonçant les grandes synthèses historiques modernes.'
);


