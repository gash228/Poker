



class Deck{
    constructor(){
        this.seznam_podoba=['kriz', 'pik', 'srce', 'karo'];
        this.seznam_vrednost=[2, 3, 4, 5, 6, 7, 8, 9, 10, 'poba', 'dama', 'kralj', 'as'];
        this.seznam_kart=[];
        this.porabljene_karte=0;
        this.Zacetek();
    }

    Zacetek(){
        this.seznam_podoba.forEach((p)=>{
            this.seznam_vrednost.forEach((vr)=>{
                this.seznam_kart.push(new Card(p, vr));
            });
        });
    }

    Reshuffle(){
        for(let i=this.seznam_kart.length-1;i>0;i--){
            let j=Math.floor(Math.random()*(i+1));
            [this.seznam_kart[i], this.seznam_kart[j]]=[this.seznam_kart[j], this.seznam_kart[i]];
        }
    }

    Izpis(){
        let deckDiv=document.createElement('div');
        deckDiv.classList.add('deck');

        this.seznam_kart.forEach((kart)=>{
            kart.Izpis();
        });

        return deckDiv;
    }

    DealCard(){
        this.porabljene_karte++;
        return this.seznam_kart[this.porabljene_karte-1];
    }
}