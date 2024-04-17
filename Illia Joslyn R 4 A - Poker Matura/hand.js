


class Hand{
    constructor(x, deck){
        this.karte=[];

        if(typeof deck==="number"){
            this.karte.push(new Card("k", 0));
            this.karte.push(new Card("k", -1));
        }
        else{
            for(let i=0;i<x;i++){
                this.karte.push(deck.DealCard());
            }
            this.open_cards=0;
        }

    }



    UpdateOpenCards(len){
        this.open_cards=len;
    }





    Izpis(x, ime, game){
        let hand=document.createElement('div');
        let name=document.createElement('label');
        let dealer=document.createElement("div");
        dealer.classList.add("dealer");
        name.innerText='Player: ' + ime;
        name.appendChild(dealer);
        name.style.padding="8px";
        name.classList.add("name");
        dealer.classList.add("hidden");
        hand.appendChild(name);
        let op=0;
        name.style.opacity=op;
        let timer=setInterval(function(){
            if(op>=1){
                clearInterval(timer);
            }
            name.style.opacity=op;
            op+=0.05;
        }, 100);
        if(ime==2 || ime==3){
            let money=document.createElement('div');
            money.classList.add('money');
            money.id=ime;
            money.textContent='Money: '+x;
            let opacity=0;
            money.style.opacity=opacity;
            hand.appendChild(money);
            let timer=setInterval(function(){
                if(opacity>=1){
                    clearInterval(timer);
                }
                money.style.opacity=opacity;
                opacity+=0.05;
            }, 100);
        }
        hand.classList.add('hand');
        this.karte.forEach((kart, index)=>{
            setTimeout(()=>{
            let kartdiv=document.createElement('div');
            kartdiv.classList.add('handcard');
            kartdiv.style.animationDelay=`${index * 0.1}s`; 
            if(index==1){
                if (ime == 2 || ime == 3) {
                    kartdiv.style.animation='dealCardAnimation23 0.5s ease-out forwards'; 
                } else {
                    kartdiv.style.animation='dealCardAnimation 0.5s ease-out forwards'; 
                }   
            }
            else{
                if (ime == 2 || ime == 3) {
                    kartdiv.style.animation='dealCardAnimation23Od 0.5s ease-out forwards'; 
                } else {
                    kartdiv.style.animation='dealCardAnimationOd 0.5s ease-out forwards'; 
                }   
            }
            kart.Izpis(kartdiv);
            hand.appendChild(kartdiv);
        }, index*100);
        });
        setTimeout(()=>{
        if(ime==1 || ime==4){
            let money=document.createElement('div');
            money.classList.add('money');
            money.id=ime;
            money.textContent='Money: '+x;
            let opacity=0;
            money.style.opacity=opacity;
            hand.appendChild(money);
            let timer=setInterval(function(){
                if(opacity>=1){
                    clearInterval(timer);
                }
                money.style.opacity=opacity;
                opacity+=0.05;
            }, 100);
        }
        }, 120);

        game.appendChild(hand);
    }




    IzpisSkrit(x, ime, game){
        let hand=document.createElement('div');
        let name=document.createElement('label');
        let dealer=document.createElement("div");
        dealer.classList.add("dealer");
        dealer.classList.add("hidden");
        name.innerText='Player: ' + ime;
        name.appendChild(dealer);
        name.style.padding="8px";
        name.classList.add("name");
        hand.appendChild(name);
        let op=0;
        name.style.opacity=op;
        let timer=setInterval(function(){
            if(op>=1){
                clearInterval(timer);
            }
            name.style.opacity=op;
            op+=0.05;
        }, 100);
        if(ime==2 || ime==3){
            let money=document.createElement('div');
            money.classList.add('money');
            money.id=ime;
            money.textContent='Money: '+x;
            let opacity=0;
            money.style.opacity=opacity;
            hand.appendChild(money);
            let timer=setInterval(function(){
                if(opacity>=1){
                    clearInterval(timer);
                }
                money.style.opacity=opacity;
                opacity+=0.05;
            }, 100);
        }
        hand.classList.add('hand');
        this.karte.forEach((kart, index)=>{
            setTimeout(()=>{
            let kartdiv=document.createElement('div');
            kartdiv.classList.add('handcard');
            kartdiv.style.animationDelay=`${index * 0.1}s`; 
            if(index==1){
                if (ime == 2 || ime == 3) {
                    kartdiv.style.animation='dealCardAnimation23 0.5s ease-out forwards'; 
                } else {
                    kartdiv.style.animation='dealCardAnimation 0.5s ease-out forwards'; 
                }   
            }
            else{
                if (ime == 2 || ime == 3) {
                    kartdiv.style.animation='dealCardAnimation23Od 0.5s ease-out forwards'; 
                } else {
                    kartdiv.style.animation='dealCardAnimationOd 0.5s ease-out forwards'; 
                }   
            }
            kart.IzpisSkrit(kartdiv);
            hand.appendChild(kartdiv);
        }, index*100);
        });
        setTimeout(()=>{
        if(ime==1 || ime==4){
            let money=document.createElement('div');
            money.classList.add('money');
            money.id=ime;
            money.textContent='Money: '+x;
            let opacity=0;
            money.style.opacity=opacity;
            hand.appendChild(money);
            let timer=setInterval(function(){
                if(opacity>=1){
                    clearInterval(timer);
                }
                money.style.opacity=opacity;
                opacity+=0.05;
            }, 100);
        }
        }, 120);

        game.appendChild(hand);
    }



    

    
    IzpisFold(i){
        let existingHand=document.querySelectorAll('.hand');
        if(i==2 || i==3){
            this.karte[0].Replace(existingHand[i-1].childNodes[2].childNodes[0]);
            this.karte[1].Replace(existingHand[i-1].childNodes[3].childNodes[0]);
        }
        else{
            this.karte[0].Replace(existingHand[i-1].childNodes[1].childNodes[0]);
            this.karte[1].Replace(existingHand[i-1].childNodes[2].childNodes[0]);
        }
    }

    RevealAll(i){
        let existingHand=document.querySelectorAll('.hand');
        if(i==2 || i==3){
            this.karte[0].Reveal(existingHand[i-1].childNodes[2].childNodes[0]);
            this.karte[1].Reveal(existingHand[i-1].childNodes[3].childNodes[0]);
        }
        else{
            this.karte[0].Reveal(existingHand[i-1].childNodes[1].childNodes[0]);
            this.karte[1].Reveal(existingHand[i-1].childNodes[2].childNodes[0]);
        }
    }

    RevealCardSr(len){
        let sredina=document.getElementById("sredina");
        this.karte[len].Reveal(sredina.childNodes[len].childNodes[0]);
    }




    Izpis_sredina(game){
        let hand=document.createElement('div');
        hand.id="sredina";

        this.karte.forEach((kart, index) =>{
            setTimeout(()=>{
            let kartdiv=document.createElement('div');
            kartdiv.classList.add('handcard_sredina');
            kartdiv.style.animation='dealCardAnimationSredina 0.5s ease-out forwards';
            kart.IzpisSkrit(kartdiv);
            hand.appendChild(kartdiv);
            }, index*120);
        });
    
        game.appendChild(hand);
    }

    AddCard(deck){
        this.karte.push(deck.DealCard());
    }





    
    async ReverseIzpisSkrit(ime, money){
        let hand=document.querySelectorAll(".hand");
        this.karte.forEach((kart, index)=>{

            setTimeout(()=>{
            let kartdiv=hand[ime-1].getElementsByClassName("handcard");
            kartdiv[index].style.animationDelay=`${index * 0.1}s`; 
            if(index==1){
                if (ime == 2 || ime == 3) {
                    kartdiv[index].style.animation='dealCardAnimation23Reversed 0.5s ease-out forwards'; 
                } else {
                    kartdiv[index].style.animation='dealCardAnimationReversed 0.5s ease-out forwards'; 
                }   
            }
            else{
                if (ime == 2 || ime == 3) {
                    kartdiv[index].style.animation='dealCardAnimation23OdReversed 0.5s ease-out forwards'; 
                } else {
                    kartdiv[index].style.animation='dealCardAnimationOdReversed 0.5s ease-out forwards'; 
                }   
            }
        }, index*100);
        });

    }

    async NoveKarte(ime){
        let hand=document.querySelectorAll(".hand");
        this.karte.forEach((kart, index)=>{
            setTimeout(()=>{
            let kartdiv=hand[ime-1].getElementsByClassName("handcard");
            kartdiv[index].style.animationDelay=`${index * 0.1}s`; 
            if(index==1){
                if (ime == 2 || ime == 3) {
                    kartdiv[index].style.animation='dealCardAnimation23 0.5s ease-out forwards'; 
                } else {
                    kartdiv[index].style.animation='dealCardAnimation 0.5s ease-out forwards'; 
                }   
            }
            else{
                if (ime == 2 || ime == 3) {
                    kartdiv[index].style.animation='dealCardAnimation23Od 0.5s ease-out forwards'; 
                } else {
                    kartdiv[index].style.animation='dealCardAnimationOd 0.5s ease-out forwards'; 
                }   
            }
            if(ime==1) kart.Izpis(kartdiv[index], true);
            else kart.IzpisSkrit(kartdiv[index], true);
        }, index*100);
        });

    }


    async ReverseIzpis_sredina(){
        let hand=document.getElementById("sredina");

        this.karte.forEach((kart, index) =>{
            setTimeout(()=>{
            let kartdiv=hand.getElementsByClassName("handcard_sredina");
            kartdiv[index].style.animation='dealCardAnimationSredinaReversed 0.5s ease-out forwards';
            }, index*90);
        });
        
    }


    async NoveKarteSredina(){
        let hand=document.getElementById("sredina");

        this.karte.forEach((kart, index) =>{
            setTimeout(()=>{
            let kartdiv=hand.getElementsByClassName("handcard_sredina");
            kartdiv[index].style.animation='dealCardAnimationSredina 0.5s ease-out forwards';
            kart.IzpisSkrit(kartdiv[index], true);
            }, index*90);
        });
        
    }



    FoldName(ime){
        let hand=document.querySelectorAll(".hand");
        let money=hand[ime-1].getElementsByClassName("money");
        let label=hand[ime-1].getElementsByClassName("name");
        money[0].style.opacity=0.2;
        label[0].style.opacity=0.2;
    }

    ReviveName(ime){
        let hand=document.querySelectorAll(".hand");
        let money=hand[ime-1].getElementsByClassName("money");
        let label=hand[ime-1].getElementsByClassName("name");
        money[0].style.opacity=1;
        label[0].style.opacity=1;
    }

}
