function getValue(p){
    if(p=='poba') return 11;
    if(p=='dama') return 12;
    if(p=='kralj') return 13;
    if(p=='as') return 14;

    return p;
}

function getValueReverse(value){
    if(value==11) return 'poba';
    if(value==12) return 'dama';
    if(value==13) return 'kralj';
    if(value==14) return 'as';

    return value;
}

function constructValueTable(igralec, sredina){
    let fun_karte=[
        igralec.hand.karte[0].vrednost,
        igralec.hand.karte[1].vrednost,
    ];

    for(let i=0;i<sredina.open_cards;i++){
        fun_karte[i+2]=sredina.karte[i].vrednost;
    }

    fun_karte=fun_karte.map(value=>getValue(value));

    return fun_karte;
}

function constructSuitTable(igralec, sredina){
    let fun_karte=[
        igralec.hand.karte[0].podoba,
        igralec.hand.karte[1].podoba,
    ];

    for(let i=0;i<sredina.open_cards;i++){
        fun_karte[i+2]=sredina.karte[i].podoba;
    }


    return fun_karte;
}

function customSort(a, b){
    let ranks={
        '1': 14,
        '11': 11,
        '12': 12,
        '13': 13
    };

    let rankA=ranks[a[0]]!==undefined ? ranks[a[0]] : parseInt(a[0]);
    let rankB=ranks[b[0]]!==undefined ? ranks[b[0]] : parseInt(b[0]);

    if(rankA===rankB){
        return a.slice(1).localeCompare(b.slice(1));
    }
    return rankA>rankB ? 1 : -1;
}





function HighestCard(igralec){
    let fun_karte=[];
    fun_karte[0]=igralec.hand.karte[0].vrednost;
    fun_karte[1]=igralec.hand.karte[1].vrednost;

    fun_karte=fun_karte.map(value=>getValue(value));
    fun_karte.sort((a, b)=>b-a);

    if(igralec.value<2){
        igralec.value=1;
    }
    for(let i=0; i<2; i++){
        if(Array.isArray(igralec.high) && igralec.high.includes(fun_karte[i])){
            continue;
        }
    
        if(fun_karte[i]!=igralec.high){
            igralec.high_card=fun_karte[i];
            break;
        }
    }
    
    
}




function isPair(igralec, sredina){
    let fun_karte=constructValueTable(igralec, sredina);
    let instances=[];
    for(let val of fun_karte){
        instances[val]=(instances[val] || 0)+1;
    }

    instances=Object.entries(instances).sort((a, b)=>b[1]-a[1]);

    for(let [key, value] of instances){
        if(value==2){
            igralec.value=2;
            igralec.high=parseInt(key);
            igralec.potential_value.push(4);
            igralec.potential_value.push(8);
            return true;
        }
    }

    return false;
}

function isDoublePair(igralec, sredina){
    let fun_karte=constructValueTable(igralec, sredina);
    let instances=[];

    for(let val of fun_karte){
        instances[val]=(instances[val] || 0)+1;
    }

    instances=Object.entries(instances).sort((a, b)=>{
        let keyA=parseInt(a[0]);
        let keyB=parseInt(b[0]);
    
        return keyB - keyA;
    });
    let izloci=0;

    for(let [key, value] of instances){
        if(value==2){
            izloci=key;
        }
    }


    if(izloci!=0){
        for(let [key, value] of instances){
            if(value==2 && key!=izloci){
                igralec.value=3;
                igralec.potential_value.push(7);
                igralec.high=[parseInt(izloci), parseInt(key)];
                return true;
            }
        }
    }

    return false;
}

function isThreeOfKind(igralec, sredina){
    let fun_karte=constructValueTable(igralec, sredina);
    let instances=[];
    for(let val of fun_karte){
        instances[val]=(instances[val] || 0)+1;
    }

    instances=Object.entries(instances).sort((a, b)=>b[1]-a[1]);

    for(let [key, value] of instances){
        if(value==3){
            igralec.value=4;
            igralec.potential_value.push(8);
            igralec.high=parseInt(key);
            return true;
        }
    }

    return false;
}




function isStraight(igralec, sredina){
    let fun_karte=constructValueTable(igralec, sredina);
    
    fun_karte=[...new Set(fun_karte)];
    fun_karte.sort((a, b)=>b-a);
    let hk=0;
    let k=0; // Koliko kart je v vrsti
    for(let i=0; i<fun_karte.length-1; i++){
        if(fun_karte[i]==fun_karte[i+1]+1){
            k++;
            if(k==1) hk=fun_karte[i];
        } else{
            k=0;
        }
        if(k==4){ 
            igralec.value=5;
            igralec.high=hk;
            return true;
        }
        if(k==3) igralec.potential_value.push(5);
    }

    fun_karte.forEach((value, key, arr) =>{
        if(value==14) arr[key]=1;
    });
    fun_karte.sort((a, b)=>b-a);
    k=0;
    for(let i=0; i<fun_karte.length-1; i++){
        if(fun_karte[i]==fun_karte[i+1]+1){
            k++;
        } else{
            k=0;
        }
        if(k==4){ 
            igralec.value=5;
            igralec.high=hk;
            return true;
        }
        if(k==3) igralec.potential_value.push(5);
    }
    return false;
}



function isFlush(igralec, sredina){
    let fun_karte=constructSuitTable(igralec, sredina);

    let fun_pod=fun_karte;
    let instances={};
    for(let i=0; i<fun_karte.length; i++){
        let val=fun_karte[i];
        instances[val]=(instances[val] || 0)+1;
    }

    let keys=Object.keys(instances);
    for(let i=0; i<keys.length; i++){
        let key=keys[i];
        let value=instances[key];
        if(value >= 5){
            igralec.value=6;
            let fun_vred=constructValueTable(igralec, sredina);
            let naj=0;
            for(let i=0; i<fun_vred.length; i++){
                let val=fun_vred[i];
                if(fun_pod[i]==key && naj <= val) naj=val;
            }
            igralec.high=naj;
            return true;
        }
        if(value==3 || value==4) igralec.potential_value.push(6);
    }

    return false;
}




function isFullHouse(igralec, sredina){
    let fun_karte=constructValueTable(igralec, sredina);
    let instances=[];
    for(let val of fun_karte){
        instances[val]=(instances[val] || 0)+1;
    }

    instances=Object.entries(instances).sort((a, b)=>b[1]-a[1]);
    let izloci=0;

    for(let [key, value] of instances){
        if(value==3){
            izloci=key;
        }
    }


    if(izloci!=0){
        for(let [key, value] of instances){
            if(value>=2 && key!=izloci){
                igralec.value=7;
                igralec.high=[parseInt(izloci), parseInt(key)];
                return true;
            }
        }
    }

    return false;
}




function isFourOfKind(igralec, sredina){
    let fun_karte=constructValueTable(igralec, sredina);
    let instances=[];
    for(let val of fun_karte){
        instances[val]=(instances[val] || 0)+1;
    }

    instances=Object.entries(instances).sort((a, b)=>b[1]-a[1]);

    for(let [key, value] of instances){
        if(value==4){
            igralec.value=8;
            igralec.high=parseInt(key);
            return true;
        }
    }

    return false;
}





function isStraightFlush(igralec, sredina){
    let fun_karte=constructValueTable(igralec, sredina);
    let fun_pod=constructSuitTable(igralec, sredina);
    let podoba=null;
    let instances=[];
    for(let val of fun_pod){
        instances[val]=(instances[val]||0)+1;
    }
    
    for(let key in instances){
        if(instances.hasOwnProperty(key) && instances[key] >= 5){
            podoba=key;
        }
    }

    fun_karte=fun_karte.map((value, key)=>value+fun_pod[key]);

    fun_karte.sort(customSort);
    fun_karte.reverse();

    fun_karte=fun_karte.filter(value=>value.includes(podoba));

    fun_karte=fun_karte.map(value=>parseInt(value.replace(/\D/g, ''), 10));
    fun_karte.sort((a, b)=>b-a);

    let hk=0;
    let k=0;
    if(fun_karte.length<5) return false;
    for(let i=0; i<fun_karte.length-1; i++){
        if(fun_karte[i]==fun_karte[i+1]+1){
            k++;
            if(k==1) hk=fun_karte[i];
        } else{
            k=0;
        }
        if(k==4){
            igralec.value=9;
            igralec.high=hk;
            return true;
        }
        if(k==3) igralec.potential_value.push(9);
    }

    fun_karte.forEach((value, key, arr) =>{
        if(value==14) arr[key]=1;
    });
    fun_karte.sort((a, b)=>b-a);

    k=0;
    for(let i=0; i<fun_karte.length-1; i++){
        if(fun_karte[i]==fun_karte[i+1]+1){
            k++;
        } else{
            k=0;
        }
        if(k==4){
            igralec.value=9;
            igralec.high=hk;
            return true;
        }
        if(k==3) igralec.potential_value.push(9);
    }
    return false;
}



function isRoyalFlush(igralec, sredina){
    let fun_karte=constructValueTable(igralec, sredina);
    let fun_pod=constructSuitTable(igralec, sredina);
    let podoba=null;
    let instances=[];

    for(let val of fun_pod){
        instances[val]=(instances[val] || 0)+1;
    }

    for(let key in instances){
        if(instances.hasOwnProperty(key) && instances[key] >= 5){
            podoba=key;
        }
    }

    fun_karte=fun_karte.map((value, key)=>value+fun_pod[key]);

    fun_karte.sort(customSort);
    fun_karte.reverse();

    fun_karte=fun_karte.filter(value=>value.includes(podoba));

    fun_karte=fun_karte.map(value=>value.replace(/\D/g, ''));

    fun_karte=fun_karte.filter(value=>value>10);
    fun_karte.sort((a, b)=>b-a);

    if(fun_karte.length==3 || fun_karte.length==4) igralec.potential_value.push(10);

    if(fun_karte.length<5) return false;
    else{
        igralec.value=10;
        return true;
    }
}



