import { useState, useEffect } from "react";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup.js";
import Main from "./Main";
import Header from "./Header";
import PopupWithForm from "./PopupWithForm.js";
import { CurrentUserContext } from "../context/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import { api } from "../utils/Api";


export default function App() {
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [currentUser, setCurrentUser] = useState({});
    const [cards, setCards] = useState([]);

    useEffect(() => {
        Promise.all([api.getUserInfo(), api.getInitialCards()])
            .then(([user, cards]) => {
                setCurrentUser(user);
                setCards(cards);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])

    function handleCardClick(data) {
        setSelectedCard(data);
    }
    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
    }
    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
    }
    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
    }

    function closeAllPopups() {
        setIsEditAvatarPopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setSelectedCard(null);
    }

    function handleCardLike(card) {
        const isLiked = card.likes.some((i) => i._id === currentUser._id);

            api.changeLikeCardStatus(card._id, !isLiked)
                .then((newCard) => {
                    setCards((state) =>
                        state.map((c) => (c._id === card._id ? newCard : c))
                    );
                })
                .catch((error) => {
                    console.log(error);
                });
    }

    function handleCardDelete(card) {
        api.deleteCard(card._id)
            .then(() => {
                setCards((prevState) => prevState.filter((c) => c._id !== card._id));
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function handleUpdateUser(user) {
        api.editProfile(user)
            .then(() => {
                setCurrentUser({ ...currentUser, name: user.name, about: user.about });
                closeAllPopups();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function handleUpdateAvatar(avatar) {
        api.changeAvatar(avatar)
            .then((user) => {
                setCurrentUser(user);
                closeAllPopups();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function handleAddPlaceSubmit(card) {
        api.createCard(card)
            .then((newCard) => {
                setCards([newCard, ...cards]);
                closeAllPopups();
            })
            .catch((error) => {
                console.log(error);
            });
    }
    return (
        <>
            <CurrentUserContext.Provider value={{currentUser} }>
                <Header />
                <Main
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onEditAvatar={handleEditAvatarClick}
                    onCardClick={handleCardClick}
                    cards={cards}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}
                />
                <Footer />

                <EditProfilePopup
                    isOpen={isEditProfilePopupOpen}
                    onClose={closeAllPopups}
                    onUpdateUser={handleUpdateUser}  />

                <AddPlacePopup
                    isOpen={isAddPlacePopupOpen}
                    onClose={closeAllPopups}
                    onAddPlace={handleAddPlaceSubmit} />

                <PopupWithForm
                    title="Вы уверены?"
                    name="del-confirm"
                    buttonText="Да"
                ></PopupWithForm>

                <EditAvatarPopup
                    onUpdateAvatar={handleUpdateAvatar}
                    isOpen={isEditAvatarPopupOpen}
                    onClose={closeAllPopups}
                />
                <ImagePopup card={selectedCard} onClose={closeAllPopups} />
            </CurrentUserContext.Provider>
        </>
    );
}
