Główny cel
Stworzenie aplikacji webowej, która odczytuje plik PDF (maksymalnie 10 MB), tworzy jego krótkie podsumowanie (3-5 zdań) i wyodrębnia dane do ustrukturyzowanego formatu JSON.
Aplikacja powinna zostać wdrożona jako publiczna wersja demonstracyjna na GitHub Pages.
Stack techniczny i architektura: Frontend: React 18+ z Vite i strict TypeScript (bez użycia typów).
Backend: Dowolna technologia (Python, Node, Cloudflare Workers itp.) do utworzenia proxy API.
Jest to konieczne, ponieważ GitHub Pages hostuje tylko pliki statyczne, a klucz API powinien być ukryty w backendzie.
Hosting i CI/CD: Opublikowanie frontendu za pomocą GitHub Actions na GitHub Pages.
Wymagana funkcjonalność (wymagania MUST): Przesłanie pliku PDF (przeciągnij i upuść) i odczytanie jego warstwy tekstowej.
Analiza AI: generowanie podsumowania w tym samym języku co dokument i wypełnianie struktury JSON ściśle według dostarczonego schematu (daty w formacie ISO 8601, waluty w ISO 4217).
Model nie powinien tworzyć danych.
Interfejs powinien wyświetlać wyniki, umożliwiać pobranie pliku .json oraz wyświetlać statusy ładowania, błędy (z możliwością ponowienia próby) i pusty ekran.
Standardy bezpieczeństwa i kodu. Krytyczne: Klucz API nigdy nie powinien być ujawniany w historii commitów front-endu ani w Git (jest to bezpośredni powód dyskwalifikacji).
Ustawienia CORS powinny zezwalać tylko na żądania z domeny demonstracyjnej.
Ochrona systemu przed atakami typu „prompt injection” (zawartość PDF powinna być traktowana wyłącznie jako dane).
Wykorzystanie ESLint, Prettier i poprawne formatowanie historii Git (konwencjonalne commity, podział na logiczne commity).