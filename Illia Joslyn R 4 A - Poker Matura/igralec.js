


class Igralec{
    constructor(x, deck){
        this.hand=new Hand(2, deck);
        this.ime=x;
        this.money=5000;
        this.latest_bid=0;
        this.folded=false;
        this.value=1;
        this.high=0;
        this.high_card=0;
        this.potential_value=Array();
        this.tactic=0;
    }

    Combination(sredina){
        isPair(this, sredina);
        isDoublePair(this, sredina);
        isThreeOfKind(this, sredina);
        isStraight(this, sredina);
        isFlush(this, sredina);
        isFullHouse(this, sredina);
        isFourOfKind(this, sredina);
        isStraightFlush(this, sredina);
        isRoyalFlush(this, sredina);
        HighestCard(this);
    }


    NovHand(deck){
        this.hand=new Hand(2, deck);
        this.value=1;
        this.high=0;
        this.high_card=0;
    }



    UpdateMoney(){
        let scor=document.getElementById(this.ime);
        scor.innerText="Money: " + this.money;
    }

    ResetBid(){
        this.latest_bid=0;
    }

    Fold(){
        this.folded=true;
        this.hand.IzpisFold(this.ime);
    }

    Unfold(){
        this.folded=false;
    }

    Reveal(){
        this.hand.RevealAll(this.ime);
    }

    Potential(){
        let self=this;
        this.potential_value=this.potential_value.filter(value=>(value>self.value));
    }


    FoldName(){
        this.hand.FoldName(this.ime);
    }


    ReviveName(){
        this.hand.ReviveName(this.ime);
    }



}