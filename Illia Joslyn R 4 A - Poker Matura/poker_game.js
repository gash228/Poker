
var game=document.createElement("div");
game.id="table";



class Igra{
    constructor(x){
        this.kup=new Deck();
        this.kup.Reshuffle();
        this.igralci=[];
        for(let i=0;i<x;i++){
            this.igralci[i]=new Igralec(i+1, this.kup);
        }
        this.sredina=new Hand(5, this.kup);
        this.current_bank=0;
        this.current_bid=0;
        this.min_bid=0;
        this.dealer=0;
        this.checked=0;
        this.open_cards_sredina=0;
        this.userInput=undefined;
        this.kombinacije={
            1: "Najvišja karta",
            2: "Pair",
            3: "Double Pair",
            4: "Three of a Kind",
            5: "Straight",
            6: "Flush",
            7: "Full House",
            8: "Four of a Kind",
            9: "Straight Flush",
            10: "Royal Flush"
        };

        this.sredina_value=0;
        this.sredina_high=0;
        this.assistantPlayer=new Igralec("help", 1);

        this.tutorial=false;
        this.previous_action='';
    }





    StartGame(){
        let menu=document.createElement("div");
        menu.id="menu";        
        let title=document.createElement("div");
        title.id="title";
        title.innerText="POKER";
        let startbutton=document.createElement("button");
        startbutton.classList.add("start-button");
        startbutton.innerText="Play";
        startbutton.onclick=()=>this.IzpisiNavadno();
        let startbutton2=document.createElement("button");
        startbutton2.classList.add("start-button");
        startbutton2.innerText="Tutorial";
        startbutton2.onclick=()=>this.Izpisi_vse();
        document.body.appendChild(menu);
        menu.appendChild(title);
        menu.appendChild(startbutton);
        menu.appendChild(startbutton2);
    }



    Izpisi_gumbe(){ //Izpiše gumbe za igranje na dnu strani
        let buttonContainer=document.createElement('div');
        buttonContainer.classList.add('button-container');
        let button1=document.createElement('button');
        button1.classList.add('button');
        button1.id="Fold";
        button1.innerText="Fold";
        button1.onclick=()=>this.Fold(1);
        buttonContainer.appendChild(button1);
        let button2=document.createElement('button');
        button2.classList.add('button');
        button2.id="Check";
        button2.innerText="Check";
        button2.onclick=()=>{
            this.checked=1;
            this.userInput=1;
        }
        buttonContainer.appendChild(button2);
        let button3=document.createElement('button');
        button3.classList.add('button');
        button3.id="All_in";
        button3.innerText="All In";
        button3.onclick=()=>this.BidAll(1);
        buttonContainer.appendChild(button3);
        let button4=document.createElement('button');
        button4.classList.add('button');
        button4.id="Bid";
        button4.innerText="Bid";
        button4.onclick=()=>this.PredNastavitve(1);
        buttonContainer.appendChild(button4);

        game.appendChild(buttonContainer);
    }



    Izbrisi_gumbe(){
        let cont=document.querySelector(".button-container");
        while(cont.firstChild){
            cont.removeChild(cont.firstChild);
        }
    }



    PredNastavitve(i){  //Ustvari polje za vnos stava
        if(this.igralci[i-1].money==0){
            return 0;
        }
        this.Izbrisi_gumbe();
        let div=document.querySelector(".button-container");
        let label=document.createElement("label");
        label.innerText="What's your bid?";
        label.classList.add("label-input");
        let slid=document.createElement("input");
        slid.type="number";
        slid.min=this.current_bid-this.igralci[i-1].latest_bid;
        if(this.current_bid==0)slid.min=this.min_bid;
        slid.max=this.igralci[i-1].money;
        let inpu=document.createElement("button");
        inpu.classList.add("button");
        inpu.innerText="Bid";
        div.appendChild(inpu);
        div.appendChild(label);
        div.appendChild(slid);

        slid.placeholder=slid.min;

        inpu.onclick=()=>{
            let n=parseInt(slid.min);
            if(slid.value!="")
                n=parseInt(slid.value);
            game.removeChild(div);
            this.Bid(i, n);
            this.userInput=1;
            this.Izpisi_gumbe();
        }
        
        }


    NastaviGumbZaIgralce(i){    //Nastavi gumbe na dnu strani za vnesenega igralca
        let button1=document.getElementById("Fold");
        button1.onclick=()=>this.Fold(i-1);
        let button3=document.getElementById("All_in");
        button3.onclick=()=>this.BidAll(i);
        let button4=document.getElementById('Bid');
        button4.onclick=()=>this.PredNastavitve(i);
    }

    DisableButtons(){
        let buttons=document.getElementsByClassName("button");
        for(let i=0;i<buttons.length; i++){
            buttons[i].disabled=true;
        }
    }
    
    EnableButtons(){
        let buttons=document.getElementsByTagName("button");
        for(let i=0;i<buttons.length; i++){
            buttons[i].disabled=false;
        }
    }

    async RevealCardSredina(){
        if(this.open_cards_sredina>=5) return 0;
        this.sredina.RevealCardSr(this.open_cards_sredina);
        this.open_cards_sredina++;
        this.sredina.UpdateOpenCards(this.open_cards_sredina);
    }

    Izpisi_vse(){
        this.Brisi_vse();
        document.body.appendChild(game);
        let bank=document.createElement('div');
        bank.id="bank";
        bank.innerText="Current Bank: " + this.current_bank;
        
        this.tutorial=true;
        game.appendChild(bank);
        this.igralci.forEach((key, index) => {
            if(index==2){
                let info=document.createElement('div');
                info.id='info';
                let button=document.createElement("button");
                button.id="central-button";
                button.innerText="Začni igro";
                info.appendChild(button);
                game.appendChild(info)
                button.onclick=()=>{
                    button.remove();
                    this.Potek();
                };
                let op=0;
                info.style.opacity=op;
                let timer=setInterval(function(){
                    if(op>=1){
                      clearInterval(timer);
                   }
                  info.style.opacity=op;
                  op+=0.05;
                }, 100);
            }
        key.hand.Izpis(key.money, key.ime, game);
        });
        this.sredina.Izpis_sredina(game);

        setTimeout(() => {
            let x=document.createElement("div");
            x.id="bid";
            x.innerText="Current bid: " + this.current_bid; 
            game.appendChild(x);
            this.Izpisi_gumbe();
            this.DisableButtons();
        }, 100);
    }


    	IzpisiNavadno(){
            this.Brisi_vse();
            document.body.appendChild(game);
            let bank=document.createElement('div');
            bank.id="bank";
            bank.innerText="Current Bank: " + this.current_bank;

            game.appendChild(bank);
            this.igralci.forEach((key, index) => {
                if(index==2){
                    let info=document.createElement('div');
                    info.id='info';
                    let button=document.createElement("button");
                    button.id="central-button";
                    button.innerText="Začni igro";
                    info.appendChild(button);
                    game.appendChild(info);
                    button.onclick=()=>{
                        button.remove();
                        this.Potek();
                    };
                    let op=0;
                    info.style.opacity=op;
                    let timer=setInterval(function(){
                        if(op>=1){
                          clearInterval(timer);
                       }
                      info.style.opacity=op;
                      op+=0.05;
                    }, 100);
                }
             if (index==0) key.hand.Izpis(key.money, key.ime, game);
                else key.hand.IzpisSkrit(key.money, key.ime, game);
          });
            this.sredina.Izpis_sredina(game);

            setTimeout(() => {
                let x=document.createElement("div");
                x.id="bid";
                x.innerText="Current bid: " + this.current_bid; 
                game.appendChild(x);
                this.Izpisi_gumbe();
                this.DisableButtons();
            }, 100);
        }




    UpdateBank(money, isAnte=false, isVictoryPot=false){ //Posodobi količino denarja, ki so ga vsi igralci do zdaj postavili
        if(isAnte) return 0;
        let scor=document.getElementById("bank");
        scor.innerText="Current Bank: " + this.current_bank;
        if(money==0 || isNaN(money)) return 0;
        let display=document.createElement("div");
        display.classList.add("bid-amount");
        if(isVictoryPot) display.innerText= "-"+money;
        else display.innerText= "+"+money;
        scor.appendChild(display);
        let opacity=1;
        let timer=setInterval(function(){
            if(opacity<=0){
                clearInterval(timer);
                scor.removeChild(display);
            }
            display.style.opacity=opacity;
            opacity-=0.1;
        }, 100);
    }

    UpdateBid(){
        let scor=document.getElementById("bid");
        scor.innerText="Current bid: " + this.current_bid;
    }


    displayBidAmount(i, money, isVictoryPot=false){
        if(money==0 || isNaN(money)) return 0;
        let igralec=document.getElementById(i);
        let display=document.createElement("div");
        display.classList.add("bid-amount");
        if(isVictoryPot) display.innerText= "+"+money;
        else display.innerText= "-"+money;
        igralec.appendChild(display);
        let opacity=1;
        let timer=setInterval(function(){
            if(opacity<=0){
                clearInterval(timer);
                igralec.removeChild(display);
            }
            display.style.opacity=opacity;
            opacity-=0.1;
        }, 100);
    }

    ResetAllBid(){  //Nastavi na nič trenutni stav in zadnji stavi pri vseh igralcih
        for(let i=0; i<this.igralci.length;i++){
            this.igralci[i].ResetBid();
        }
        this.current_bid=0;
    
    }



    async VictoryPot(i){
        let won=this.current_bank;
        this.current_bank=0;
        this.igralci[i].money+=won;
        this.UpdateBank(won, false, true);
        this.igralci[i].UpdateMoney();
        this.displayBidAmount(i+1, won, true);
    }


    async VictoryPotMultiple(x){

        let won=this.current_bank;
        this.current_bank=0;
        this.UpdateBank(won, false, true);

        x.forEach((value)=>{
            this.igralci[value].money+=won/x.length;        
            this.igralci[value].UpdateMoney();
            this.displayBidAmount(value+1, won/x.length, true);
        }
        );
    }



    Bid(i, money, isAnte=false){

        if(money==0){
           this.checked=1; 
           return 0;
        } 

        if(money<this.current_bid-this.igralci[i-1].latest_bid){
            money=this.current_bid-this.igralci[i-1].latest_bid;
        }

        if(money>this.igralci[i-1].money) money=this.igralci[i-1].money;

        this.igralci[i-1].money-=money;
        this.current_bank+=money;


        if(money+this.igralci[i-1].latest_bid>this.current_bid) this.current_bid=money+this.igralci[i-1].latest_bid;
        this.igralci[i-1].latest_bid+=money;

        this.UpdateBank(money, isAnte);
        this.igralci[i-1].UpdateMoney();
        this.displayBidAmount(i, money);
        if(!isAnte) this.UpdateBid();
    }

    Call(i){
        this.Bid(i, this.current_bid-this.igralci[i-1].latest_bid);
    }

    Raise(i, money){
        this.Bid(i, this.current_bid-this.igralci[i-1].latest_bid+money);
    }

    Fold(i){
        this.igralci[i].Fold();
        this.userInput=1;
        this.igralci[i].FoldName();
    }




    StillActivePlayers(){
        let x=0;
        for(let i=0;i<this.igralci.length;i++){
            if(this.igralci[i].money>0 && this.igralci[i].folded==false) x++;
        }
        return x;
    }



    async RevealPlayersCards(){
        for(let i=1; i<this.igralci.length;i++){
            if(this.igralci[i].folded) continue;
            this.igralci[i].Reveal();
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }


    PlayersPotential(){
        for(let i=0; i<this.igralci.length; i++) this.igralci[i].Potential();
    }


    BidAll(i){
        this.current_bank+=this.igralci[i-1].money;
        let x=this.igralci[i-1].money;
        this.igralci[i-1].money=0;

        if(x+this.igralci[i-1].latest_bid>this.current_bid) this.current_bid=x+this.igralci[i-1].latest_bid;
        this.igralci[i-1].latest_bid+=x;
        this.userInput=1;
        this.UpdateBank(x);
        this.igralci[i-1].UpdateMoney();
        this.displayBidAmount(i, x);
    }

    async Ante(){
        for(let i=0; i<this.igralci.length; i++){
            this.Bid(i+1, 100, true);
        }
        this.ResetAllBid();
        this.UpdateBank(100*this.igralci.length);
    }


    Brisi_vse(){
        while (document.body.firstChild){
            document.body.removeChild(document.body.firstChild);
        }
    }

    assignCard(vred, pod, x){
        if(vred>10) vred=getValueReverse(vred);

        this.sredina.karte[x].podoba=pod;
        this.sredina.karte[x].vrednost=vred;
    }

    assignCardRandSuit(vred, x){
        if(vred>10) vred=getValueReverse(vred);

        this.sredina.karte[x].podoba=this.kup.seznam_podoba[Math.floor(Math.random()*this.kup.seznam_podoba.length)];
        this.sredina.karte[x].vrednost=vred;
    }


    async getSredinaValue(){
        this.assistantPlayer.Combination(this.sredina);
        this.sredina_value=this.assistantPlayer.value;
        this.sredina_high=this.assistantPlayer.high;
        if(this.sredina_value==1) this.sredina_value=0;
    }

    async assignDealer(){
        let d=document.querySelectorAll(".dealer");
        d[this.dealer].classList.remove("hidden");
    }


    async removeDealer(){
        let d=document.querySelectorAll(".dealer");
        for(let i=0;i<d.length;i++){
            d[i].classList.add("hidden");
        }
    }

    async GetNextDealer(){
        await this.removeDealer();
        this.dealer++;
        this.dealer=this.dealer%this.igralci.length;    
        if(this.igralci[this.dealer].money==0) this.dealer++;
        this.dealer=this.dealer%this.igralci.length;        
        await this.assignDealer();
    }


    async removeCards(){
        for(let i=0;i<this.igralci.length;i++){
            if(this.igralci[i].money==0) continue;
            this.igralci[i].hand.ReverseIzpisSkrit(this.igralci[i].ime);
        }
    }


    async newCards(){
        for(let i=0;i<this.igralci.length;i++){
            if(this.igralci[i].money==0) continue;
            this.igralci[i].hand.NoveKarte(this.igralci[i].ime);
        }
    }


    novNaborKartZaVse(){
        for(let i=0;i<this.igralci.length;i++){
            if(this.igralci[i].money==0){
                this.igralci[i].Fold();
                this.igralci[i].FoldName();
                continue;
            }
            this.igralci[i].ReviveName(); 
            this.igralci[i].NovHand(this.kup);
        }
    }


    NoveKarteSredina(){
        this.sredina.ReverseIzpis_sredina();
        setTimeout(()=>{
            this.sredina.NoveKarteSredina();
        }, 500);
    }



    async NewGame(){
        this.UpdateBid();
        this.ResetAllBid();
        this.sredina_value=0;
        this.sredina_high=0;
        this.open_cards_sredina=0;
        for(let i=0;i<this.igralci.length;i++){
            this.igralci[i].Unfold();
        }
        
        let button=document.getElementById("central-button");
        button.innerText="Zacni igro";
        button.onclick=()=>{
            button.remove();
            this.Potek();
        };

        await this.removeCards();

        this.kup=new Deck();
        this.kup.Reshuffle();

        this.novNaborKartZaVse();
        this.NoveKarteSredina();

        this.sredina=new Hand(5, this.kup);
        await new Promise(resolve => setTimeout(resolve, 600));
        await this.newCards();
        this.GetNextDealer();
    }



    async PlayerWin(){
        this.igralci.forEach((val)=>{
            val.Combination(this.sredina);
        });

        let zmagovit_igralec=this.igralci.length;
        let pomozni_igralec=[];
        this.igralci[zmagovit_igralec]=new Igralec(zmagovit_igralec+1, this.kup);
        this.igralci[zmagovit_igralec].value=0;
        this.igralci[zmagovit_igralec].high_card=0;
        this.igralci[zmagovit_igralec].high=0;

        outerLoop: for(let i=0;i<this.igralci.length-1;i++){
            if(this.igralci[i].folded) continue;
            if(this.igralci[i].value>this.igralci[zmagovit_igralec].value){
                zmagovit_igralec=i;
                pomozni_igralec=[];
                continue;
            } 
            else if(this.igralci[i].value==this.igralci[zmagovit_igralec].value){
                if(this.igralci[i].value==7 || this.igralci[i].value==3){
                    for(let j=0; j<2; j++){
                        if(Array.isArray(this.igralci[i].high) && Array.isArray(this.igralci[zmagovit_igralec].high)){
                            if(this.igralci[i].high[j]>this.igralci[zmagovit_igralec].high[j]){
                                zmagovit_igralec=i;
                                pomozni_igralec=[];
                                continue outerLoop;
                            } 
                            else if(this.igralci[i].high[j]<this.igralci[zmagovit_igralec].high[j]){
                                continue outerLoop;
                            }
                        } 
                        else{
                            if(this.igralci[i].high[j]>this.igralci[zmagovit_igralec].high){
                                zmagovit_igralec=i;
                                pomozni_igralec=[];
                                continue outerLoop;
                            } else if(this.igralci[i].high[j]<this.igralci[zmagovit_igralec].high){
                                continue outerLoop;
                            }
                        }
                    }
                    
                    if(this.igralci[i].value==7){
                        if(pomozni_igralec.length==0) pomozni_igralec[zmagovit_igralec]=zmagovit_igralec;
                            pomozni_igralec[i]=i;
                            continue;
                        }
                    else{ 
                        if(this.igralci[i].high_card>this.igralci[zmagovit_igralec].high_card){
                                zmagovit_igralec=i;
                                pomozni_igralec=[];
                                continue;
                        }
                        else if(this.igralci[i].high_card<this.igralci[zmagovit_igralec].high_card){
                                continue;
                        } 
                        else{
                                if(pomozni_igralec.length==0) pomozni_igralec[zmagovit_igralec]=zmagovit_igralec;
                                pomozni_igralec[i]=i;
                                continue;
                        }
                        
                    }
                }
                 else{
                    if(this.igralci[i].high>this.igralci[zmagovit_igralec].high){
                        zmagovit_igralec=i;
                        pomozni_igralec=[];
                        continue;
                    }
                    else{
                        if(this.igralci[i].high<this.igralci[zmagovit_igralec].high){
                            continue;
                        } 
                        else{
                            if([1, 2, 4, 8].includes(this.igralci[i].value)){
                                if(this.igralci[i].high_card>this.igralci[zmagovit_igralec].high_card){
                                    zmagovit_igralec=i;
                                    pomozni_igralec=[];
                                    continue;
                                } 
                                else{
                                    if(this.igralci[i].high_card<this.igralci[zmagovit_igralec].high_card){
                                        continue;
                                    } 
                                    else{
                                        if(pomozni_igralec.length==0) pomozni_igralec[zmagovit_igralec]=zmagovit_igralec;
                                        pomozni_igralec[i]=i;
                                        continue;
                                    }
                                }
                            } 
                            else{
                                if(pomozni_igralec.length==0) pomozni_igralec[zmagovit_igralec]=zmagovit_igralec;
                                pomozni_igralec[i]=i;
                                continue;
                            }
                        }
                    }
                }
            }
        }
        

        pomozni_igralec=pomozni_igralec.filter(vred=>vred!=undefined);

        this.igralci.pop();



        if(pomozni_igralec.length==0){
            console.log('Zmagal je igralec '+this.igralci[zmagovit_igralec].ime+' s kombinacijo '+this.kombinacije[this.igralci[zmagovit_igralec].value]);
            await new Promise(resolve => setTimeout(resolve, 300));
            let info=document.getElementById("info");
            await new Promise(resolve => {
                let op=0;
                info.style.opacity=op;
                info.innerText="The winner is " + this.igralci[zmagovit_igralec].ime;
                let timer=setInterval(function () {
                    if (op >= 1) {
                        clearInterval(timer);
                        resolve();
                    }
                    info.style.opacity=op;
                    op += 0.05;
                }, 40);
            });
            await new Promise(resolve => setTimeout(resolve, 300));
            await this.VictoryPot(zmagovit_igralec);
        }


        
        else{
            let info=document.getElementById("info");
            let text="The winners are ";

            for(let i=0;i<pomozni_igralec.length;i++){
                console.log('Zmagal je igralec '+this.igralci[pomozni_igralec[i]].ime+' s kombinacijo '+this.kombinacije[this.igralci[pomozni_igralec[i]].value]);
                text+=this.igralci[pomozni_igralec[i]].ime + " and ";
            }

            text=text.slice(0, -4);
            await new Promise(resolve => {
                let op=0;
                info.style.opacity=op;
                info.innerText=text;
                let timer=setInterval(function () {
                    if (op >= 1) {
                        clearInterval(timer);
                        resolve();
                    }
                    info.style.opacity=op;
                    op += 0.05;
                }, 40);
            });
            await new Promise(resolve => setTimeout(resolve, 300));
            await this.VictoryPotMultiple(pomozni_igralec);
        }
        
    }


    AllPlayersBid(){
        let skupno=0;
        let skupni_bid=0;
        for(let i=0; i<this.igralci.length; i++){
            if(!this.igralci[i].folded){
                skupno+=this.igralci[i].money;
                skupni_bid+=this.igralci[i].latest_bid;
            }
        }
        if(skupno==0) return true;
        if(this.current_bid==0 && this.checked==0) return false;
        for(let i=0; i<this.igralci.length; i++){
            if(this.igralci[i].latest_bid!=this.current_bid && !this.igralci[i].folded){
                return false;
            }
        }
        return true;
    }



    WinScreen(){
        let d=document.createElement("div");
        d.id="win_screen";
        let izpis=document.createElement("div");
        izpis.id="win_write";
        izpis.innerText="You won";
        izpis.style.animation="winScreenAnimation 1s ease-out forwards";
        d.appendChild(izpis);
        game.appendChild(d);

        let op=0;
        d.style.opacity=op;
        let timer=setInterval(function(){
            if(op>=1){
                clearInterval(timer);
            }
            d.style.opacity=op;
            op+=0.05;
        }, 70);

        let button=document.createElement("button");
        button.innerText="New Game";
        button.classList.add("end-button");
        button.onclick=()=>{
            this.Brisi_vse();
            location.reload();
        }
        setTimeout(()=>{
            op=0;
            d.appendChild(button);
            button.style.opacity=op;
            let timer=setInterval(function(){
                if(op>=1){
                    clearInterval(timer);
                }
                button.style.opacity=op;
                op+=0.05;
            }, 70);
    
        }, 2000)
    }



    LoseScreen(){
        let d=document.createElement("div");
        d.id="lose_screen";
        let izpis=document.createElement("div");
        izpis.id="win_write";
        izpis.innerText="You lost";
        izpis.style.animation="winScreenAnimation 1s ease-out forwards";
        d.appendChild(izpis);
        game.appendChild(d);

        let op=0;
        d.style.opacity=op;
        let timer=setInterval(function(){
            if(op>=1){
                clearInterval(timer);
            }
            d.style.opacity=op;
            op+=0.05;
        }, 70);

        let button=document.createElement("button");
        button.innerText="Restart";
        button.classList.add("end-button");
        button.onclick=()=>{
            this.Brisi_vse();
            location.reload();
        }
        setTimeout(()=>{
            op=0;
            d.appendChild(button);
            button.style.opacity=op;
            let timer=setInterval(function(){
                if(op>=1){
                    clearInterval(timer);
                }
                button.style.opacity=op;
                op+=0.05;
            }, 70);
    
        }, 2000)

    }



    getTactic(i){
        let random=Math.floor(Math.random()*10)+1;
        random+=this.igralci[i].value;
        if(this.igralci[i].value==this.sredina_value) random-=this.sredina_value;
        if(random<=3) return 1;
        if([4, 7, 9].includes(random)) return 2;
        if([5, 6, 8, 12, 15, 17, 19].includes(random)) return 3;
        if([10, 11, 13, 14, 16, 18, 20].includes(random)) return 4;
    }



    getCallProbability(tactic){
        if(tactic==1){
            if(this.current_bid==0) return 50; 
            else return Math.round(((9*this.current_bid)/1150)+(470/23));
        }
        if(tactic==2){
            if(this.current_bid==0) return 80; 
            else if(this.current_bid>3200) return 10;
            else return Math.round(((-1*this.current_bid)/50)+(75));
        }
        if(tactic==3){
            if(this.current_bid==0) return 40; 
            else return Math.round((-1*this.current_bid/150)+(125/3));
        }
        if(tactic==4){
            if(this.current_bid==0) return 15; 
            else return Math.round((this.current_bid/150)+(71/3));
        }
    }

    getRaiseProbability(tactic){
        if(tactic==1){
            if(this.current_bid==0) return 50; 
            else return Math.round(((-7*this.current_bid)/575)+(1666/23));
        }
        if(tactic==2){
            if(this.current_bid==0) return 20; 
            else return Math.round(((-1*this.current_bid)/750)+(31/3));
        }
        if(tactic==3){
            if(this.current_bid==0) return 60; 
            else return Math.round((-3*this.current_bid/275)+(580/11));
        }
        if(tactic==4){
            if(this.current_bid==0) return 85; 
            else return Math.round((-7*this.current_bid/600)+(217/3));
        }
    }

    getFoldProbability(tactic){
        if(tactic==1){
            if(this.current_bid==0) return 0; 
            else return Math.round((this.current_bid/230)+(164/23));
        }
        if(tactic==2){
            if(this.current_bid==0) return 0; 
            else return Math.round((19*this.current_bid/1125)+(232/9));
        }
        if(tactic==3){
            if(this.current_bid==0) return 0; 
            else return Math.round((11*this.current_bid/450)+(35/9));
        }
        if(tactic==4){
            if(this.current_bid==0) return 0; 
            else return Math.round((this.current_bid/200)+4);
        }
    }

    getProbabilities(tactic, i){
        let fold=this.getFoldProbability(tactic);
        let raise=this.getRaiseProbability(tactic);
        let call=this.getCallProbability(tactic);
        if(this.previous_action=="Raise") raise=Math.round(raise/2.2);
        let rand=Math.floor(Math.random()*(fold+raise+call))+1;
        if(rand<=fold) return 'Fold';
        else if(rand<=(fold+raise)) return 'Raise';
        else if(rand<=(fold+raise+call)) return 'Call';
    }



    async BidCircle(){
        this.UpdateBid();
        let self=this;
        async function waitForBid() {
            return new Promise(resolve => {
                function checkInput() {
                    if (self.userInput !== undefined) {
                        resolve();
                    } else {
                        setTimeout(checkInput, 100);
                    }
                }
                checkInput();
            });
        }
    
        async function Bidding() {
            let koliko_igralcev=self.igralci.length;
            let info=document.getElementById('info');
            for (let i=self.dealer; i<koliko_igralcev+self.dealer; i++) {
                let playerIndex=i % koliko_igralcev;
                info.innerText='';
                if(self.igralci[playerIndex].latest_bid===self.current_bid && self.current_bid !== 0) continue;
                if(self.igralci[playerIndex].folded) continue;
                if(self.igralci[playerIndex].money==0) continue;

                await new Promise(resolve => {
                    let op=0;
                    info.style.opacity=op;
                    if(!self.igralci[playerIndex].folded)
                        info.innerText=self.igralci[playerIndex].ime + "'s turn...";
                    else info.innerText="Skip";
                    let timer=setInterval(function () {
                        if (op >= 1) {
                            clearInterval(timer);
                            resolve();
                        }
                        info.style.opacity=op;
                        op += 0.05;
                    }, 25);
                });
        


                if (playerIndex==0) {
                    self.EnableButtons();
                    self.NastaviGumbZaIgralce(1);
                    let check=document.getElementById("Check");
                    if(self.current_bid-self.igralci[playerIndex].latest_bid!=0) check.disabled=true;
                    await waitForBid();
                    if(self.checked==1){
                        continue;
                    }
                } else {
                    self.DisableButtons();
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    self.igralci[playerIndex].tactic=self.getTactic(playerIndex);
                    let action=self.getProbabilities(self.igralci[playerIndex].tactic, playerIndex);
                    self.previous_action=action;
                    if(action=='Fold'){
                        self.Fold(playerIndex);
                        info.innerText=self.igralci[playerIndex].ime + " folds";
                    }
                    if(action=='Raise'){
                        let r=Math.floor(Math.random()*10)+1;
                        self.Raise(playerIndex+1, r*10*self.igralci[playerIndex].value);
                    }
                    if(action=='Call'){
                        self.Call(playerIndex+1);
                        if(self.current_bid==0){
                            info.innerText=self.igralci[playerIndex].ime + " checks";
                        }
                    }
                }
                self.UpdateBid();

            }
            self.userInput=undefined;
            await new Promise(resolve => {
                let op=1;
                info.style.opacity=op;
                let timer=setInterval(function () {
                    if (op <= 0) {
                        clearInterval(timer);
                        resolve();
                    }
                    info.style.opacity=op;
                    op -= 0.05;
                }, 25);
            });
        }

        async function BidInProgress(){
            console.log("Start of Bidding Circle");
            do{
                if(self.StillActivePlayers()==1) break;
                await Bidding();
                info.innerText='';
                self.previous_action='';
                self.UpdateBid();
            }while(!self.AllPlayersBid()) 
            self.ResetAllBid();
            self.DisableButtons();
            console.log("End of Bidding Circle");

        }
        await BidInProgress();

        this.checked=0;

    }






    async Potek(){
        let self=this;


        await self.assignDealer();
        await self.Ante();

        await self.BidCircle();
        
        await new Promise(resolve => setTimeout(resolve, 400));
        for(let i=0;i<3;i++){
            this.RevealCardSredina();
        }
        await new Promise(resolve => setTimeout(resolve, 4000));
        await self.getSredinaValue();


        await self.BidCircle();
        await new Promise(resolve => setTimeout(resolve, 300));


        await self.RevealCardSredina();
        await new Promise(resolve => setTimeout(resolve, 3000));
        await self.BidCircle();
        await new Promise(resolve => setTimeout(resolve, 300));


        await self.RevealCardSredina();
        await new Promise(resolve => setTimeout(resolve, 300));
        await self.BidCircle();
        await new Promise(resolve => setTimeout(resolve, 300));


        await self.RevealPlayersCards();
        await self.PlayerWin();
        await new Promise(resolve => setTimeout(resolve, 3000));
       let info=document.getElementById("info");
       info.innerText='';
       let button=document.createElement("button");
       button.id="central-button";
       button.innerText="Nadaljuj z igro";
       info.appendChild(button);
       button.onclick=()=>{
           this.NewGame();
       };
       if(this.tutorial==true){
        button.innerText="Vrni na glavni zaslon";
        button.onclick=()=>{
            this.tutorial=false;
            location.reload();
        };
       }

       if(this.igralci[0].money==0){
        button.disabled=true;
        await new Promise(resolve => setTimeout(resolve, 1300));
         this.LoseScreen();
       }

       
       if(this.igralci[0].money==20000){
        await new Promise(resolve => setTimeout(resolve, 1300));
         this.WinScreen();
       }
        
    }


}








