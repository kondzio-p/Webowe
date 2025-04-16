import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent {
  title = 'loadFromJSON';
  images: { name: string; title: string }[] = [];

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const rawText = reader.result as string;
      
      try {
        // Usuwamy otaczające nawiasy klamrowe i niepotrzebne znaki
        const cleanText = rawText
          .replace(/^\s*{\s*/, '')     
          .replace(/\s*}\s*$/, '');   

        // Wyciągamy wszystkie obiekty z tekstu
        const objects = cleanText.split('},');
        
        // Tworzymy tablicę poprawionych obiektów
        const fixedObjects = [];
        
        for (let i = 0; i < objects.length; i++) {
          // Pomijamy puste obiekty
          if (!objects[i].trim()) continue;
          
          let obj = objects[i].trim();
          
          // Upewnij się, że zaczyna się od {
          if (!obj.startsWith('{')) {
            obj = '{' + obj;
          }
          
          // Upewnij się, że kończy się na }
          if (!obj.endsWith('}')) {
            obj = obj + '}';
          }
          
          // Napraw klucze i wartości
          obj = obj
            .replace(/\{name:/g, '{"name":')
            .replace(/,\s*title\s*:/g, ',"title":');
          
          fixedObjects.push(obj);
        }
        
        // Połącz w prawidłowy JSON
        const jsonArray = '[' + fixedObjects.join(',') + ']';
        
        console.log('Naprawiony JSON:', jsonArray);
        
        // Parsuj i ustaw dane
        this.images = JSON.parse(jsonArray);
      } catch (e) {
        console.error('Błąd parsowania JSON:', e);
        console.log('Próbowaliśmy przetworzyć:', rawText);
      }
    };

    reader.readAsText(file);
  }

  // Nowa funkcja do zapisywania ścieżek obrazów do pliku
  saveImagePaths(): void {
    if (this.images.length === 0) {
      alert('Nie ma żadnych obrazów do zapisania!');
      return;
    }

    try {
      // Tworzenie zawartości pliku JSON
      const jsonContent = JSON.stringify(this.images, null, 2);
      
      // Tworzenie obiektu Blob z danymi JSON
      const blob = new Blob([jsonContent], { type: 'application/json' });
      
      // Tworzenie URL dla Blob
      const url = window.URL.createObjectURL(blob);
      
      // Tworzenie elementu <a> do pobrania pliku
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = 'image-paths.json';
      
      // Dodanie do DOM, kliknięcie i usunięcie
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Zwolnienie URL
      window.URL.revokeObjectURL(url);
      
      alert('Plik został zapisany pomyślnie!');
    } catch (error) {
      console.error('Błąd podczas zapisywania pliku:', error);
      alert('Wystąpił błąd podczas zapisywania pliku!');
    }
  }
}