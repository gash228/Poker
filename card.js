


class Card{
    constructor(p, vr){
        this.podoba=p;
        this.vrednost=vr;
    }

    getSuite(p){
        switch(p){
            case 'kriz':
                return "Clubs";
            case 'pik':
                return "Spades";
            case 'srce':
                return "Hearts";
            case 'karo':
                return "Diamonds";
            default:
                return "";
        }
    }

    getValue(p){
        switch(p){
            case 'poba':
                return "J";
            case 'dama':
                return "Q";
            case 'kralj':
                return "K";
            case 'as':
                return "A";
            default:
                return p;
        }
    }

    Izpis(x, isExisting=false){
        let suite=this.getSuite(this.podoba);
        let value=this.getValue(this.vrednost);
        let url=`Cards/card${suite}${value}.png`;

        let img=document.createElement("img");
        img.src=url;
        img.alt="Image";

        
        if(!isExisting) x.appendChild(img);
        else x.replaceChild(img, x.firstChild);
    }

    IzpisSkrit(x, isExisting=false){
        let url="Cards/cardClosed.png";

        let img=document.createElement("img");
        img.src=url;
        img.alt="Image";

        if(!isExisting) x.appendChild(img);
        else x.replaceChild(img, x.firstChild);
    }

    Replace(x){

        if(x instanceof HTMLImageElement){
            if(x.src.includes("Cards/cardClosed.png")){
                 return 0;
            }
            else{
                let suite=this.getSuite(this.podoba);
                let value=this.getValue(this.vrednost);
                let url=`Cards/card${suite}${value}.png`;
                let newImg=document.createElement("img");
                newImg.src=url;
                let oldImg=document.createElement("img");
                oldImg.src="Cards/cardClosed.png";
            
                let revealCard=document.createElement("div");
                revealCard.classList.add("reveal-card");
            
                let revealCardback=document.createElement("div");
                revealCardback.classList.add("reveal-card-back");
                revealCardback.appendChild(oldImg);
            
                let revealCardfront=document.createElement("div");
                revealCardfront.classList.add("reveal-card-front");
                revealCardfront.appendChild(newImg);
                revealCard.appendChild(revealCardfront);
                revealCard.appendChild(revealCardback);

          
            
                x.parentNode.replaceChild(revealCard, x);
            
                setTimeout(() => {
                    revealCard.classList.add("revealed");
                }, 100);
                return 0;
            }
        } 

        if(!(x.parentNode.classList.contains("handcard_sredina"))){
            if(x.querySelector(".reveal-card-back").firstChild.src.includes("Cards/cardClosed.png")) return 0;
        }

        let suite=this.getSuite(this.podoba);
        let value=this.getValue(this.vrednost);
        let url=`Cards/card${suite}${value}.png`;
        
        let newImg=document.createElement("img");
        newImg.src=url;
        let oldImg=document.createElement("img");
        oldImg.src="Cards/cardClosed.png";
    
        let revealCard=document.createElement("div");
        revealCard.classList.add("reveal-card");
    
        let revealCardback=document.createElement("div");
        revealCardback.classList.add("reveal-card-back");
        revealCardback.appendChild(oldImg);
    
        let revealCardfront=document.createElement("div");
        revealCardfront.classList.add("reveal-card-front");
        revealCardfront.appendChild(newImg);
        revealCard.appendChild(revealCardfront);
        revealCard.appendChild(revealCardback);

  
    
        x.parentNode.replaceChild(revealCard, x);
    
        setTimeout(() => {
            revealCard.classList.add("revealed");
        }, 100);
    }

    Reveal(x){
        
        if(x instanceof HTMLImageElement){
            if(!(x.src.includes("Cards/cardClosed.png"))) return 0;
        }

        else if(!(x.parentNode.classList.contains("handcard_sredina"))){
            if(x.querySelector(".reveal-card-front").firstChild.src.includes("Cards/cardClosed.png")) return 0;
        }
        let suite=this.getSuite(this.podoba);
        let value=this.getValue(this.vrednost);
        let url=`Cards/card${suite}${value}.png`;
        
        let newImg=document.createElement("img");
        newImg.src=url;
        let oldImg=document.createElement("img");
        oldImg.src="Cards/cardClosed.png";
    
        let revealCard=document.createElement("div");
        revealCard.classList.add("reveal-card");
    
        let revealCardback=document.createElement("div");
        revealCardback.classList.add("reveal-card-front");
        revealCardback.appendChild(oldImg);
    
        let revealCardfront=document.createElement("div");
        revealCardfront.classList.add("reveal-card-back");
        revealCardfront.appendChild(newImg);
    
        revealCard.appendChild(revealCardback);
        revealCard.appendChild(revealCardfront);
  
    
        x.parentNode.replaceChild(revealCard, x);
    
        setTimeout(() => {
            revealCard.classList.add("revealed");
        }, 100);
    }
}