import React from 'react';

class Header extends React.Component {
	/*le header ici on fait un regex ?
	//https://fr.wikipedia.org/wiki/Expression_r%C3%A9guli%C3%A8re
	function et condition*/
	convertirPseudo = (pseudo) => {
		return /[aeiouy]/i.test(pseudo[0]) ? `d'${pseudo}` : `de ${pseudo}`;
	};

	render() {
		return (
			<header>
				<h1>La boîte à recettes {this.convertirPseudo(this.props.pseudo)}</h1>
			</header>
		)
	}
//PropTypes debug verififie si c'est bien conform au string
	static propTypes = {
	  pseudo: React.PropTypes.string.isRequired
	};
}

export default Header;
