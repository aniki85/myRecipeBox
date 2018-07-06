// React
import React from 'react';
//Components
import Header from './Header';
import Admin from './Admin';
import Card from './Card';
// Importer les recettes
import recettes from '../recettes';
//Importer fire base
import base from '../base';
class App extends React.Component {

	state = {
		recettes: {}
	};
	//cycle de vie des Components syncrhoniser l'user et firebase
	//https://reactjs.org/docs/state-and-lifecycle.html
	componentWillMount() {
		this.ref = base.syncState(`${this.props.params.pseudo}/recettes`, {
			context: this,
			state: 'recettes'
		});
	}
//cycle de vie des Components désynchroniser l'user de firebase
	componentWillUnmount() {
	  base.removeBinding(this.ref);
	}
	chargerExemple = () => {
		this.setState({ recettes });
	};
	//Ajoute une recettes
//Important a retenir on crée une nouvelle recette et on va dans app admin
ajouterRecette = (recette) => {
		const recettes = {...this.state.recettes};
		const timestamp = Date.now();
    recettes[`recette-${timestamp}`] = recette;
		this.setState({ recettes });
	};
//modifier la recette
	majRecette = (key, majRecette) => {
		const recettes = {...this.state.recettes};
		recettes[key] = majRecette;
		this.setState({ recettes });
	};
	//supprimer une recette
	supprimerRecette = (key) => {
	const recettes = {...this.state.recettes};
	recettes[key] = null;
	this.setState({ recettes });
};
	render() {
//l'admin
//A retenir! on fait une boucle pour aller chercher les recettes des utilisateurs
		const cards = Object
			.keys(this.state.recettes)
			.map(key => <Card key={key} details={this.state.recettes[key]} />);

			return (
				<div className="box">
					<Header pseudo={this.props.params.pseudo} />
					<div className="cards">
						{cards}
					</div>
					<Admin
						recettes={this.state.recettes}
						chargerExemple={this.chargerExemple}
						ajouterRecette={this.ajouterRecette}
						majRecette={this.majRecette}
						supprimerRecette={this.supprimerRecette}
						pseudo={this.props.params.pseudo}
					/>
				</div>
			)
		}

	static propTypes = {
	  params: React.PropTypes.object.isRequired
	};
}

export default App;
