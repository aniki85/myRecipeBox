import React from 'react';
import AjouterRecette from './AjouterRecette';
import base from '../base';
class Admin extends React.Component {
//crée un state
state = {
	uid: null,
	owner: null
};
//cycle de vie des Components syncrhoniser l'user et firebase
//https://reactjs.org/docs/state-and-lifecycle.html
componentDidMount() {
	base.onAuth(user => {
		if (user) {
			this.traiterConnexion(null, { user })
		}
	})
}
/*modifier une recette on la recupere ...recette ça recupere le nom l'image etc
on recupere chaque varaible par un [event.target.name]: event.target.value
puis on recupere la clez et tous ce mais a jour*/
	traiterChangement = (event, key) => {
		const recette = this.props.recettes[key];
		const majRecette = {
			...recette,
			[event.target.name]: event.target.value
		};
		this.props.majRecette(key, majRecette);
	};
	//Connexion et Deconnexion
	connexion = (provider) => {
		console.log(`Tentative de connexion avec ${provider}`);
		base.authWithOAuthPopup(provider, this.traiterConnexion);
	};

	deconnexion = () => {
		base.unauth();
		this.setState({ uid: null });
	}

	traiterConnexion = (err, authData) => {

		if (err) {
			console.log(err);
			return;
		}

		// récupérer le nom de la boîte
		const boxRef = base.database().ref(this.props.pseudo);

		// Demander à firebase les données
		boxRef.once('value', (snapshot) => {

			const data = snapshot.val() || {};

			// Attribuer la box si elle n'est à personne
			if(!data.owner) {
				boxRef.set({
					owner: authData.user.uid
				})
			}

			this.setState({
				uid: authData.user.uid,
				owner: data.owner || authData.user.uid
			});

		});
	};
	//login
	/*il faut crée un compte developer sur facebook //twitter google github etc*/
	/*connection avec firebase et facebook developer*/
	renderLogin = () => {
	return (
			<div className="login">
				<h2>Connecte toi pour créer tes recettes !</h2>
				<button className="facebook-button" onClick={() => this.connexion('facebook')} >Me connecter avec Facebook</button>

			</div>
	)
};
//l'admin modifie une recette
	renderAdmin = (key) => {
		const recette = this.props.recettes[key];
		return (
			<div className="card" key={key} >
				<form className="admin-form">

					<input type="text" name="nom" placeholder="Nom de la recette" value={recette.nom} onChange={(e) => this.traiterChangement(e, key)} />

					<input type="text" name="image" placeholder="Adresse de l'image" value={recette.image} onChange={(e) => this.traiterChangement(e, key)} />

					<textarea name="ingredients" rows="3" placeholder="Liste des ingrédients" value={recette.ingredients} onChange={(e) => this.traiterChangement(e, key)} ></textarea>

					<textarea name="instructions" rows="15" placeholder="Liste des instructions" value={recette.instructions} onChange={(e) => this.traiterChangement(e, key)} ></textarea>

				</form>
					<button onClick={() => this.props.supprimerRecette(key)} >Supprimer</button>
			</div>
		)
	};
//on crée une boucle pour allez chercher tous les objects a modifier
	render() {
		const deconnexion = <button onClick={this.deconnexion} >Déconnexion!</button>

//verifier un propietaire
if (!this.state.uid) {
			return <div>{this.renderLogin()}</div>
		}
// propietaire du compte verifier
	if (this.state.uid !== this.state.owner){
		return (
				<div className="login">
					{this.renderLogin()}
				</div>
				)
	}
		const adminCards = Object
			.keys(this.props.recettes)
			.map(this.renderAdmin);

		return (
			<div className="cards">
			<AjouterRecette ajouterRecette={this.props.ajouterRecette} />
			{adminCards}
				<footer>
					<button onClick={this.props.chargerExemple} >Remplir</button>
					{deconnexion}
				</footer>
			</div>
		)
	}
//verifie mes function object
	static propTypes = {
		recettes: React.PropTypes.object.isRequired,
		chargerExemple: React.PropTypes.func.isRequired,
		ajouterRecette: React.PropTypes.func.isRequired,
		majRecette: React.PropTypes.func.isRequired,
		supprimerRecette: React.PropTypes.func.isRequired,
		pseudo: React.PropTypes.string.isRequired
	};

}

export default Admin;
