*** Settings ***
Library    SeleniumLibrary
Documentation    Testa os fluxos de limpar o carrinho e tentar finalizar a compra com o carrinho vazio.

*** Variables ***
${LOGIN_PAGE}        http://localhost:8000/index.html
${DASHBOARD_PAGE}    http://localhost:8000/dashboard.html
${BROWSER}           Chrome  # Mantendo o navegador visível para depuração
${VALID_USER}        admin
${VALID_PASSWORD}    123456

*** Keywords ***
Realizar Login e Ir para o Dashboard
    [Documentation]    Encapsula os passos de login para reutilização.
    Open Browser    ${LOGIN_PAGE}    ${BROWSER}
    Maximize Browser Window
    Input Text      id=username      ${VALID_USER}
    Input Text      id=password      ${VALID_PASSWORD}
    Click Button    xpath=//button[@type='submit']
    Wait Until Location Is    ${DASHBOARD_PAGE}
    Wait Until Element Is Visible    id=catalog    timeout=10s

Adicionar Notebook ao Carrinho
    [Documentation]    Adiciona o "Notebook Legacy" ao carrinho e verifica se ele foi adicionado.
    Wait Until Element Is Visible    xpath=//h3[text()="Notebook Legacy"]
    Click Button    xpath=//div[h3[text()="Notebook Legacy"]]//button
    Wait Until Page Contains Element    xpath=//li[contains(., "Notebook Legacy")]    timeout=5s
    Element Text Should Be    id=cart-total-value    R$ 2.599,00

*** Test Cases ***
Adicionar Produto e Depois Limpar o Carrinho
    [Documentation]    Este teste verifica se a funcionalidade "Limpar Carrinho" funciona corretamente.
    [Tags]    carrinho    limpeza

    Realizar Login e Ir para o Dashboard
    
    Adicionar Notebook ao Carrinho
    
    # Etapa 3: Clicar no botão "Limpar Carrinho"
    Click Button    id=clear-cart-btn
    
    # Etapa 4: Verificar se o carrinho está vazio
    Wait Until Page Contains    Seu carrinho está vazio.    timeout=5s
    Element Text Should Be    id=cart-total-value    R$ 0,00
    
    [Teardown]    Close Browser


Tentar Finalizar Compra Após Limpar o Carrinho
    [Documentation]    Este teste adiciona um item, limpa o carrinho e depois tenta finalizar a compra.
    [Tags]    carrinho    finalizacao    validacao

    Realizar Login e Ir para o Dashboard
    
    Adicionar Notebook ao Carrinho
    
    # Etapa 3: Limpar o carrinho
    Click Button    id=clear-cart-btn
    Wait Until Page Contains    Seu carrinho está vazio.    timeout=5s

    # Etapa 4: Clicar em "Finalizar Compra" e verificar o alerta
    Click Button    id=finalize-btn
    ${mensagem_alerta}=    Handle Alert    ACCEPT    timeout=5s
    
    # Etapa 5: Validar a mensagem do alerta
    Should Be Equal    ${mensagem_alerta}    Seu carrinho está vazio!

    [Teardown]    Close Browser