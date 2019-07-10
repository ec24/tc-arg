#include<bits/stdc++.h>

using namespace std;

typedef long long ll;

bool is_prime(ll m) { // esto tiene complejidad O(sqrt(m))
	//sirve para m<=10^14
	if(m==1) return false;
	for(ll a=2;a*a<=m;a++) {
		if(m%a==0) {
			//int b = m/a;
			//tengo que a*b = m; O SEA m NO  ES PRIMO
			return false;
		}
	}
	return true;
}

vector<ll> factorize(ll m) {
	// esto funca para m<=10^13
	if(m==1) return {};
	vector<ll> fact;
	for(ll a=2;a*a<=m;a++) {
		while(m%a==0) { //este a si o si es primo
			assert(is_prime(a));
			fact.push_back(a);
			m/=a;
		}
	}
	if(m!=1) fact.push_back(m);
	return fact;
}

const int MAXN = 1000000;
bool criba[MAXN]; //criba[i] = true significa que i es primo
ll criba2[MAXN];


void fill_criba() {
	memset(criba,-1,sizeof(criba)); //seteo todos en true
	//esto es O(MAXN * log(log(MAXN)))
	criba[0]=false;
	criba[1]=false;
	for(int i=2;i<MAXN;i++) {
		if(criba[i]==true) {
			for(int j=2*i;j<MAXN;j+=i) {
				criba[j]=false;
			}
		}
	}
}


void fill_criba2() {
	memset(criba2,-1,sizeof(criba2)); //seteo todos en true
	//esto es O(MAXN * log(log(MAXN)))
	criba2[0]=0;
	criba2[1]=1;
	for(int i=2;i<MAXN;i++) {
		if(criba2[i]==-1) {
			for(int j=i;j<MAXN;j+=i) {
				criba2[j]=i;
			}
		}
	}
}

vector<ll> factorize_criba(ll m) {
	vector<ll> fact;
	ll pos = m;
	while(pos!=1) {
		fact.push_back(criba2[pos]);
		pos/=criba2[pos];
	}
	sort(fact.begin(),fact.end());
	return fact;
}

ll gcd(ll a, ll b) {//no hace falta, usar __gcd(a,b)
	if(b<a) swap(a,b);
	if(a==0) return b;
	else {
		return gcd(b%a,a);
	}
}

ll mcm(ll a, ll b) {
	return (a/gcd(a,b)) * b;
}

vector<ll> all_divisors(ll m) {
	vector<ll> divs;
	for(ll a=1;a*a<=m;a++) {
		if(m%a==0) {
			divs.push_back(a);
			if(a!=m/a) divs.push_back(m/a);
		}
	}
	sort(divs.begin(),divs.end());
	return divs;
}

int main() {
	ll m=1;
	fill_criba();
	fill_criba2();
	while(m) {
		scanf("%lld",&m);
		vector<ll> f = factorize_criba(m);
		for(auto d:f) {
			printf("%lld ",d);
		}
		puts("");
	}
	return 0;
}
