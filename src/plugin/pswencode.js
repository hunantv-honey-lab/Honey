/*
 *
 * SB的加密方法
 *
 * */honey.def(function(a){function b(){return time=String(Date.parse(new Date)).substring(0,10),rd=String(Math.random()),nonce=String(rd+time+time+rd).substring(0,32),time+nonce}function c(a,b,c){this.e=K(a),this.d=K(b),this.m=K(c),this.chunkSize=2*P(this.m),this.radix=16,this.barrett=new bg(this.m)}function d(a){return(a<10?"0":"")+String(a)}function e(a,b){var c=new Array,d=b.length,e=0;while(e<d)c[e]=b.charCodeAt(e),e++;while(c.length%a.chunkSize!=0)c[e++]=0;var f=c.length,g="",h,i,j;for(e=0;e<f;e+=a.chunkSize){j=new x,h=0;for(i=e;i<e+a.chunkSize;++h)j.digits[h]=c[i++],j.digits[h]+=c[i++]<<8;var k=a.barrett.powMod(j,a.e),l=a.radix==16?H(k):D(k,a.radix);g+=l+" "}return g.substring(0,g.length-1)}function f(a,b){var c=b.split(" "),d="",e,f,g;for(e=0;e<c.length;++e){var h;a.radix==16?h=K(c[e]):h=L(c[e],a.radix),g=a.barrett.powMod(h,a.d);for(f=0;f<=P(g);++f)d+=String.fromCharCode(g.digits[f]&255,g.digits[f]>>8)}return d.charCodeAt(d.length-1)==0&&(d=d.substring(0,d.length-1)),d}function u(a){q=a,r=new Array(q);for(var b=0;b<r.length;b++)r[b]=0;s=new x,t=new x,t.digits[0]=1}function x(a){typeof a=="boolean"&&a==1?this.digits=null:this.digits=r.slice(0),this.isNeg=!1}function y(a){var b=a.charAt(0)=="-",c=b?1:0,d;while(c<a.length&&a.charAt(c)=="0")++c;if(c==a.length)d=new x;else{var e=a.length-c,f=e%v;f==0&&(f=v),d=A(Number(a.substr(c,f))),c+=f;while(c<a.length)d=N(R(d,w),A(Number(a.substr(c,v)))),c+=v;d.isNeg=b}return d}function z(a){var b=new x(!0);return b.digits=a.digits.slice(0),b.isNeg=a.isNeg,b}function A(a){var b=new x;b.isNeg=a<0,a=Math.abs(a);var c=0;while(a>0)b.digits[c++]=a&o,a=Math.floor(a/l);return b}function B(a){var b="";for(var c=a.length-1;c>-1;--c)b+=a.charAt(c);return b}function D(a,b){var c=new x;c.digits[0]=b;var d=ba(a,c),e=C[d[1].digits[0]];while(_(d[0],s)==1)d=ba(d[0],c),digit=d[1].digits[0],e+=C[d[1].digits[0]];return(a.isNeg?"-":"")+B(e)}function E(a){var b=new x;b.digits[0]=10;var c=ba(a,b),d=String(c[1].digits[0]);while(_(c[0],s)==1)c=ba(c[0],b),d+=String(c[1].digits[0]);return(a.isNeg?"-":"")+B(d)}function G(a){var b=15,c="";for(i=0;i<4;++i)c+=F[a&b],a>>>=4;return B(c)}function H(a){var b="",c=P(a);for(var d=P(a);d>-1;--d)b+=G(a.digits[d]);return b}function I(a){var b=48,c=b+9,d=97,e=d+25,f=65,g=90,h;return a>=b&&a<=c?h=a-b:a>=f&&a<=g?h=10+a-f:a>=d&&a<=e?h=10+a-d:h=0,h}function J(a){var b=0,c=Math.min(a.length,4);for(var d=0;d<c;++d)b<<=4,b|=I(a.charCodeAt(d));return b}function K(a){var b=new x,c=a.length;for(var d=c,e=0;d>0;d-=4,++e)b.digits[e]=J(a.substr(Math.max(d-4,0),Math.min(d,4)));return b}function L(a,b){var c=a.charAt(0)=="-",d=c?1:0,e=new x,f=new x;f.digits[0]=1;for(var g=a.length-1;g>=d;g--){var h=a.charCodeAt(g),i=I(h),j=S(f,i);e=N(e,j),f=S(f,b)}return e.isNeg=c,e}function M(a){return(a.isNeg?"-":"")+a.digits.join(" ")}function N(a,b){var c;if(a.isNeg!=b.isNeg)b.isNeg=!b.isNeg,c=O(a,b),b.isNeg=!b.isNeg;else{c=new x;var d=0,e;for(var f=0;f<a.digits.length;++f)e=a.digits[f]+b.digits[f]+d,c.digits[f]=e%l,d=Number(e>=l);c.isNeg=a.isNeg}return c}function O(a,b){var c;if(a.isNeg!=b.isNeg)b.isNeg=!b.isNeg,c=N(a,b),b.isNeg=!b.isNeg;else{c=new x;var d,e;e=0;for(var f=0;f<a.digits.length;++f)d=a.digits[f]-b.digits[f]+e,c.digits[f]=d%l,c.digits[f]<0&&(c.digits[f]+=l),e=0-Number(d<0);if(e==-1){e=0;for(var f=0;f<a.digits.length;++f)d=0-c.digits[f]+e,c.digits[f]=d%l,c.digits[f]<0&&(c.digits[f]+=l),e=0-Number(d<0);c.isNeg=!a.isNeg}else c.isNeg=a.isNeg}return c}function P(a){var b=a.digits.length-1;while(b>0&&a.digits[b]==0)--b;return b}function Q(a){var b=P(a),c=a.digits[b],d=(b+1)*k,e;for(e=d;e>d-k;--e){if((c&32768)!=0)break;c<<=1}return e}function R(a,b){var c=new x,d,e=P(a),f=P(b),g,i,k;for(var l=0;l<=f;++l){d=0,k=l;for(j=0;j<=e;++j,++k)i=c.digits[k]+a.digits[j]*b.digits[l]+d,c.digits[k]=i&o,d=i>>>h;c.digits[l+e+1]=d}return c.isNeg=a.isNeg!=b.isNeg,c}function S(a,b){var c,d,e;result=new x,c=P(a),d=0;for(var f=0;f<=c;++f)e=result.digits[f]+a.digits[f]*b+d,result.digits[f]=e&o,d=e>>>h;return result.digits[1+c]=d,result}function T(a,b,c,d,e){var f=Math.min(b+e,a.length);for(var g=b,h=d;g<f;++g,++h)c[h]=a[g]}function V(a,b){var c=Math.floor(b/k),d=new x;T(a.digits,0,d.digits,c,d.digits.length-c);var e=b%k,f=k-e;for(var g=d.digits.length-1,h=g-1;g>0;--g,--h)d.digits[g]=d.digits[g]<<e&o|(d.digits[h]&U[e])>>>f;return d.digits[0]=d.digits[g]<<e&o,d.isNeg=a.isNeg,d}function X(a,b){var c=Math.floor(b/k),d=new x;T(a.digits,c,d.digits,0,a.digits.length-c);var e=b%k,f=k-e;for(var g=0,h=g+1;g<d.digits.length-1;++g,++h)d.digits[g]=d.digits[g]>>>e|(d.digits[h]&W[e])<<f;return d.digits[d.digits.length-1]>>>=e,d.isNeg=a.isNeg,d}function Y(a,b){var c=new x;return T(a.digits,0,c.digits,b,c.digits.length-b),c}function Z(a,b){var c=new x;return T(a.digits,b,c.digits,0,c.digits.length-b),c}function $(a,b){var c=new x;return T(a.digits,0,c.digits,0,b),c}function _(a,b){if(a.isNeg!=b.isNeg)return 1-2*Number(a.isNeg);for(var c=a.digits.length-1;c>=0;--c)if(a.digits[c]!=b.digits[c])return a.isNeg?1-2*Number(a.digits[c]>b.digits[c]):1-2*Number(a.digits[c]<b.digits[c]);return 0}function ba(a,b){var c=Q(a),d=Q(b),e=b.isNeg,f,g;if(c<d)return a.isNeg?(f=z(t),f.isNeg=!b.isNeg,a.isNeg=!1,b.isNeg=!1,g=O(b,a),a.isNeg=!0,b.isNeg=e):(f=new x,g=z(a)),new Array(f,g);f=new x,g=a;var h=Math.ceil(d/k)-1,i=0;while(b.digits[h]<m)b=V(b,1),++i,++d,h=Math.ceil(d/k)-1;g=V(g,i),c+=i;var j=Math.ceil(c/k)-1,p=Y(b,j-h);while(_(g,p)!=-1)++f.digits[j-h],g=O(g,p);for(var q=j;q>h;--q){var r=q>=g.digits.length?0:g.digits[q],s=q-1>=g.digits.length?0:g.digits[q-1],u=q-2>=g.digits.length?0:g.digits[q-2],v=h>=b.digits.length?0:b.digits[h],w=h-1>=b.digits.length?0:b.digits[h-1];r==v?f.digits[q-h-1]=o:f.digits[q-h-1]=Math.floor((r*l+s)/v);var y=f.digits[q-h-1]*(v*l+w),A=r*n+(s*l+u);while(y>A)--f.digits[q-h-1],y=f.digits[q-h-1]*(v*l|w),A=r*l*l+(s*l+u);p=Y(b,q-h-1),g=O(g,S(p,f.digits[q-h-1])),g.isNeg&&(g=N(g,p),--f.digits[q-h-1])}return g=X(g,i),f.isNeg=a.isNeg!=e,a.isNeg&&(e?f=N(f,t):f=O(f,t),b=X(b,i),g=O(b,g)),g.digits[0]==0&&P(g)==0&&(g.isNeg=!1),new Array(f,g)}function bb(a,b){return ba(a,b)[0]}function bc(a,b){return ba(a,b)[1]}function bd(a,b,c){return bc(R(a,b),c)}function be(a,b){var c=t,d=a;for(;;){(b&1)!=0&&(c=R(c,d)),b>>=1;if(b==0)break;d=R(d,d)}return c}function bf(a,b,c){var d=t,e=a,f=b;for(;;){(f.digits[0]&1)!=0&&(d=bd(d,e,c)),f=X(f,1);if(f.digits[0]==0&&P(f)==0)break;e=bd(e,e,c)}return d}function bg(a){this.modulus=z(a),this.k=P(this.modulus)+1;var b=new x;b.digits[2*this.k]=1,this.mu=bb(b,this.modulus),this.bkplus1=new x,this.bkplus1.digits[this.k+1]=1,this.modulo=bh,this.multiplyMod=bi,this.powMod=bj}function bh(a){var b=Z(a,this.k-1),c=R(b,this.mu),d=Z(c,this.k+1),e=$(a,this.k+1),f=R(d,this.modulus),g=$(f,this.k+1),h=O(e,g);h.isNeg&&(h=N(h,this.bkplus1));var i=_(h,this.modulus)>=0;while(i)h=O(h,this.modulus),i=_(h,this.modulus)>=0;return h}function bi(a,b){var c=R(a,b);return this.modulo(c)}function bj(a,b){var c=new x;c.digits[0]=1;var d=a,e=b;for(;;){(e.digits[0]&1)!=0&&(c=this.multiplyMod(c,d)),e=X(e,1);if(e.digits[0]==0&&P(e)==0)break;d=this.multiplyMod(d,d)}return c}a.encodePassword=function(a){var d="A5245A4630DD7CE9D8A967E33A50EB52C2634FD042C4BFBCF5A5C1317A234FD0D1D2C75D083946AF70CE480C399FAD8EEBE9F5A904F30E4D3C91CDD7C27C4D07E27015D46B29A003E9D49834E19041A7BA45A95E6161697975721E88949E8023DA682895086223683593F054E7AAE0E07C40DB33BD80EE5909CE48D17C07D097";return u(131),a=b()+a,e(new c("10001","",d),a)};var g=2,h=16,k=h,l=65536,m=l>>>1,n=l*l,o=l-1,p=9999999999999998,q,r,s,t;u(20);var v=15,w=A(1e15),C=new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"),F=new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"),U=new Array(0,32768,49152,57344,61440,63488,64512,65024,65280,65408,65472,65504,65520,65528,65532,65534,65535),W=new Array(0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535)});