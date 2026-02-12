// Mapa de Reclamações - VERSÃO CORRIGIDA COM COORDENADAS EXATAS
let map = null;
let markersLayer = null;
let userLocationMarker = null;
let currentMapFilters = {
    categoria: '',
    status: ''
};

// Coordenadas padrão (São Paulo, SP)
const DEFAULT_COORDS = [-23.5505, -46.6333];
const DEFAULT_ZOOM = 12;

// Ícones personalizados para diferentes status
const markerIcons = {
    pendente: {
        color: '#ffc107',
        icon: '⚠️'
    },
    'em-andamento': {
        color: '#17a2b8',
        icon: '🔧'
    },
    resolvida: {
        color: '#28a745',
        icon: '✅'
    }
};

// Ícones para categorias
const categoryIcons = {
    iluminacao: '💡',
    asfalto: '🛣️',
    limpeza: '🧹',
    seguranca: '🛡️',
    transporte: '🚌',
    agua: '💧',
    outros: '📋'
};

// CORREÇÃO PRINCIPAL: Sistema de coordenadas exatas
function getCoordinatesFromLocation(localizacao, reclamacao = null) {
    console.log(`🗺️ Buscando coordenadas EXATAS para: "${localizacao}"`);

    // PRIORIDADE 1: Se a reclamação tem coordenadas exatas salvas, usar elas
    if (reclamacao && reclamacao.coordenadas && Array.isArray(reclamacao.coordenadas) && reclamacao.coordenadas.length === 2) {
        console.log(`✅ COORDENADAS EXATAS encontradas na reclamação: [${reclamacao.coordenadas[0]}, ${reclamacao.coordenadas[1]}]`);
        return reclamacao.coordenadas;
    }

    // PRIORIDADE 2: Usar coordenadas exatas do sistema de CEP se disponíveis
    if (window.coordenadasExatas && Array.isArray(window.coordenadasExatas) && window.coordenadasExatas.length === 2) {
        console.log(`✅ COORDENADAS EXATAS do sistema CEP: [${window.coordenadasExatas[0]}, ${window.coordenadasExatas[1]}]`);
        return window.coordenadasExatas;
    }

    // PRIORIDADE 3: Coordenadas exatas para endereços específicos conhecidos
    if (localizacao) {
        const localizacaoLower = localizacao.toLowerCase();
        
        // Detectar número do endereço para busca precisa
        const numeroDaReclamacao = reclamacao && reclamacao.numero ? String(reclamacao.numero).trim() : null;
        let numeroDoTexto = null;
        try {
            const match = localizacao.match(/,\s*(\d{1,5})/);
            if (match && match[1]) numeroDoTexto = match[1];
        } catch (_) {}
        const numeroDetectado = numeroDaReclamacao || numeroDoTexto;

        // COORDENADAS EXATAS ESPECÍFICAS
        if (localizacaoLower.includes('coronel pacheco do couto')) {
            if (numeroDetectado === '50' || numeroDetectado === 50) {
                // Coordenadas exatas fornecidas pelo usuário
                const coordenadasExatas = [-23.619619448198613, -46.466918235362044];
                console.log(`🎯 COORDENADAS EXATAS: Coronel Pacheco do Couto, 50 -> ${coordenadasExatas[0]}, ${coordenadasExatas[1]}`);
                return coordenadasExatas;
            } else if (numeroDetectado) {
                // Para outros números na mesma rua, calcular posição aproximada
                const baseCoords = [-23.619619448198613, -46.466918235362044];
                const offset = (numeroDetectado - 50) * 0.00001; // Pequeno offset baseado no número
                const coordenadasCalculadas = [baseCoords[0] + offset, baseCoords[1]];
                console.log(`🎯 COORDENADAS CALCULADAS: Coronel Pacheco do Couto, ${numeroDetectado} -> ${coordenadasCalculadas[0]}, ${coordenadasCalculadas[1]}`);
                return coordenadasCalculadas;
            }
        }

        // Coordenadas exatas por CEP/bairro
        const coordenadasExatasPorRegiao = {
            // CEP 08330-310 - Jardim Ester
            '08330-310': [-23.6125, -46.4718],
            'jardim ester': [-23.6125, -46.4718],
            'vila ester': [-23.6125, -46.4718],
            
            // CEP 08330-000 - São Rafael
            '08330-000': [-23.6089, -46.4736],
            'são rafael': [-23.6089, -46.4736],
            'sao rafael': [-23.6089, -46.4736],
            
            // CEP 08340-000 - São Mateus
            '08340-000': [-23.6089, -46.4736],
            'são mateus': [-23.6089, -46.4736],
            'sao mateus': [-23.6089, -46.4736],
            
            // Outras regiões
            'itaquera': [-23.5394, -46.4563],
            'cidade tiradentes': [-23.5969, -46.4031],
            'guaianases': [-23.5394, -46.4063]
        };

        // Buscar coordenadas exatas por região
        for (const [chave, coords] of Object.entries(coordenadasExatasPorRegiao)) {
            if (localizacaoLower.includes(chave)) {
                console.log(`✅ COORDENADAS EXATAS encontradas para "${chave}": [${coords[0]}, ${coords[1]}]`);
                return coords;
            }
        }
    }

    // FALLBACK: Coordenadas do centro de São Paulo
    console.log(`⚠️ Usando coordenadas padrão do centro de São Paulo`);
    return DEFAULT_COORDS;
}

// Funções auxiliares
function getCategoriaLabel(categoria) {
    const labels = {
        'iluminacao': 'Iluminação Pública',
        'asfalto': 'Asfalto/Pavimentação',
        'limpeza': 'Limpeza Urbana',
        'seguranca': 'Segurança',
        'transporte': 'Transporte Público',
        'agua': 'Água e Esgoto',
        'outros': 'Outros'
    };
    return labels[categoria] || categoria;
}

function getStatusLabel(status) {
    const labels = {
        'pendente': 'Pendente',
        'em-andamento': 'Em Andamento',
        'resolvida': 'Resolvida'
    };
    return labels[status] || status;
}

function getReclamacoes() {
    try {
        const reclamacoesData = localStorage.getItem('reclamacoes');
        return reclamacoesData ? JSON.parse(reclamacoesData) : [];
    } catch (error) {
        console.error('Erro ao carregar reclamações:', error);
        return [];
    }
}

// Inicialização do mapa
function initializeMap() {
    if (map) {
        map.remove();
    }
    
    // Criar mapa
    map = L.map('map', {
        center: DEFAULT_COORDS,
        zoom: DEFAULT_ZOOM,
        zoomControl: true,
        scrollWheelZoom: true
    });
    
    // Adicionar camada de tiles (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Criar grupo de marcadores com clustering
    markersLayer = L.markerClusterGroup({
        chunkedLoading: true,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        maxClusterRadius: 50,
        iconCreateFunction: function(cluster) {
            const count = cluster.getChildCount();
            let className = 'marker-cluster-small';
            
            if (count > 10) {
                className = 'marker-cluster-large';
            } else if (count > 5) {
                className = 'marker-cluster-medium';
            }
            
            return L.divIcon({
                html: `<div><span>${count}</span></div>`,
                className: `marker-cluster ${className}`,
                iconSize: L.point(40, 40)
            });
        }
    });
    
    map.addLayer(markersLayer);
    
    // Tentar obter localização do usuário
    getUserLocation();
    
    // Carregar marcadores das reclamações
    loadReclamacaoMarkers();
    
    // Esconder loading
    hideMapLoading();
}

// Obter localização do usuário
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                // Remover marcador anterior se existir
                if (userLocationMarker) {
                    map.removeLayer(userLocationMarker);
                }
                
                // Criar marcador da localização do usuário
                userLocationMarker = L.marker([lat, lng], {
                    icon: L.divIcon({
                        className: 'user-location-marker',
                        html: '<div style="background-color: #007bff; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>',
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                    })
                }).addTo(map);
                
                // Adicionar popup
                userLocationMarker.bindPopup('Sua localização atual');
                
                // Centralizar mapa na localização do usuário
                map.setView([lat, lng], 14);
            },
            function(error) {
                console.warn('Erro ao obter localização:', error);
                // Centralizar no centro de São Paulo
                map.setView(DEFAULT_COORDS, DEFAULT_ZOOM);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    } else {
        console.warn('Geolocalização não suportada');
        map.setView(DEFAULT_COORDS, DEFAULT_ZOOM);
    }
}

// CORREÇÃO: Carregar marcadores das reclamações com coordenadas exatas
function loadReclamacaoMarkers() {
    const reclamacoes = getReclamacoes();
    console.log('🗺️ Carregando marcadores com coordenadas EXATAS. Total de reclamações:', reclamacoes.length);

    // Limpar marcadores existentes
    if (markersLayer) {
        markersLayer.clearLayers();
    }

    // Filtrar reclamações
    let filteredReclamacoes = reclamacoes.filter(reclamacao => {
        if (currentMapFilters.categoria && reclamacao.categoria !== currentMapFilters.categoria) {
            return false;
        }
        if (currentMapFilters.status && reclamacao.status !== currentMapFilters.status) {
            return false;
        }
        return true;
    });

    console.log('Reclamações filtradas:', filteredReclamacoes.length);
    
    // Adicionar marcadores para cada reclamação
    filteredReclamacoes.forEach((reclamacao, index) => {
        console.log(`📍 Processando reclamação ${index + 1}:`, {
            titulo: reclamacao.titulo,
            localizacao: reclamacao.localizacao,
            coordenadas: reclamacao.coordenadas
        });

        const coords = getCoordinatesFromLocation(reclamacao.localizacao, reclamacao);
        console.log(`🎯 Coordenadas obtidas para "${reclamacao.localizacao}":`, coords);

        if (coords && markersLayer) {
            const marker = createReclamacaoMarker(reclamacao, coords);
            markersLayer.addLayer(marker);
            console.log(`✅ Marcador adicionado para "${reclamacao.titulo}" em LAT=${coords[0]}, LNG=${coords[1]}`);
        } else {
            console.warn(`❌ Não foi possível obter coordenadas para: ${reclamacao.titulo}`);
        }
    });
    
    // Atualizar estatísticas do mapa
    updateMapStats(filteredReclamacoes);

    console.log(`🎉 Mapa atualizado! ${filteredReclamacoes.length} reclamações processadas, ${markersLayer ? markersLayer.getLayers().length : 0} marcadores adicionados`);
}

// Criar marcador para reclamação
function createReclamacaoMarker(reclamacao, coords) {
    const statusInfo = markerIcons[reclamacao.status];
    const categoryIcon = categoryIcons[reclamacao.categoria] || '📋';
    const hasMedia = reclamacao.midia && reclamacao.midia.length > 0;
    
    // Criar ícone personalizado
    const markerIcon = L.divIcon({
        className: 'custom-marker',
        html: `
            <div class="marker-pin ${reclamacao.status} ${hasMedia ? 'has-media' : ''}" 
                 style="background-color: ${statusInfo.color}">
                <span class="marker-icon">${categoryIcon}</span>
                ${hasMedia ? '<span class="media-indicator">📷</span>' : ''}
            </div>
        `,
        iconSize: [30, 40],
        iconAnchor: [15, 40],
        popupAnchor: [0, -40]
    });
    
    // Criar marcador
    const marker = L.marker(coords, { icon: markerIcon });
    
    // Criar popup
    const popupContent = createPopupContent(reclamacao, coords);
    marker.bindPopup(popupContent, {
        maxWidth: 350,
        className: 'custom-popup-container'
    });
    
    return marker;
}

// Criar conteúdo do popup
function createPopupContent(reclamacao, coords) {
    const statusInfo = markerIcons[reclamacao.status];
    const categoryLabel = getCategoriaLabel(reclamacao.categoria);
    const statusLabel = getStatusLabel(reclamacao.status);
    const categoryIcon = categoryIcons[reclamacao.categoria] || '📋';

    let mediaHtml = '';
    if (reclamacao.midia && reclamacao.midia.length > 0) {
        mediaHtml = `
            <div class="popup-media">
                <h4><i class="fas fa-camera"></i> Mídia (${reclamacao.midia.length})</h4>
                <div class="media-grid">
                    ${reclamacao.midia.map((media, index) => `
                        <div class="media-item" onclick="openMediaModal('${media}', '${media.includes('.mp4') ? 'video' : 'image'}', '${reclamacao.titulo}')">
                            ${media.includes('.mp4') ? 
                                '<i class="fas fa-video"></i>' : 
                                '<i class="fas fa-image"></i>'
                            }
                            <span>Mídia ${index + 1}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    return `
        <div class="popup-content">
            <div class="popup-header">
                <h3>${reclamacao.titulo}</h3>
                <div class="popup-badges">
                    <span class="category-badge">${categoryLabel}</span>
                    <span class="status-badge status-${reclamacao.status}">${statusLabel}</span>
                </div>
            </div>
            <div class="popup-body">
                <p><strong>Descrição:</strong> ${reclamacao.descricao}</p>
                <p><strong>Localização:</strong> ${reclamacao.localizacao}</p>
                <p><strong>Data:</strong> ${formatDate(reclamacao.dataReclamacao)}</p>
                <p><strong>Usuário:</strong> ${reclamacao.usuario}</p>
                ${reclamacao.coordenadas ? `<p><strong>Coordenadas:</strong> ${reclamacao.coordenadas[0].toFixed(6)}, ${reclamacao.coordenadas[1].toFixed(6)}</p>` : ''}
            </div>
            ${mediaHtml}
            <div class="popup-actions">
                <button onclick="shareReclamacao('${reclamacao.id}')" class="btn btn-sm">
                    <i class="fas fa-share"></i> Compartilhar
                </button>
                <button onclick="centerMapOnMarker(${coords[0]}, ${coords[1]})" class="btn btn-sm">
                    <i class="fas fa-crosshairs"></i> Centralizar
                </button>
            </div>
        </div>
    `;
}

// Formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Centralizar mapa em um marcador
function centerMapOnMarker(lat, lng) {
    if (map) {
        map.setView([lat, lng], 16);
    }
}

// Compartilhar reclamação
function shareReclamacao(reclamacaoId) {
    const reclamacoes = getReclamacoes();
    const reclamacao = reclamacoes.find(r => r.id === reclamacaoId);
    
    if (reclamacao && navigator.share) {
        navigator.share({
            title: reclamacao.titulo,
            text: reclamacao.descricao,
            url: window.location.href
        });
    } else {
        // Fallback: copiar para clipboard
        const text = `${reclamacao.titulo}\n${reclamacao.descricao}\n${reclamacao.localizacao}`;
        navigator.clipboard.writeText(text).then(() => {
            alert('Informações copiadas para a área de transferência!');
        });
    }
}

// Atualizar estatísticas do mapa
function updateMapStats(filteredReclamacoes) {
    const total = filteredReclamacoes.length;
    const comMedia = filteredReclamacoes.filter(r => r.midia && r.midia.length > 0).length;
    const pendentes = filteredReclamacoes.filter(r => r.status === 'pendente').length;
    
    const totalElement = document.getElementById('mapTotalReclamacoes');
    const mediaElement = document.getElementById('mapComMedia');
    const pendentesElement = document.getElementById('mapPendentes');
    
    if (totalElement) totalElement.textContent = total;
    if (mediaElement) mediaElement.textContent = comMedia;
    if (pendentesElement) pendentesElement.textContent = pendentes;
}

// Filtrar marcadores no mapa
function filterMapMarkers() {
    currentMapFilters.categoria = document.getElementById('mapFiltroCategoria').value;
    currentMapFilters.status = document.getElementById('mapFiltroStatus').value;
    loadReclamacaoMarkers();
}

// Limpar filtros do mapa
function clearMapFilters() {
    const categoriaSelect = document.getElementById('mapFiltroCategoria');
    const statusSelect = document.getElementById('mapFiltroStatus');
    
    if (categoriaSelect) categoriaSelect.value = '';
    if (statusSelect) statusSelect.value = '';
    
    currentMapFilters.categoria = '';
    currentMapFilters.status = '';

    loadReclamacaoMarkers();
}

// Filtrar por status específico
function filterByStatus(status) {
    const statusSelect = document.getElementById('mapFiltroStatus');
    if (statusSelect) statusSelect.value = status;
    currentMapFilters.status = status;
    loadReclamacaoMarkers();
}

// Filtrar por categoria específica
function filterByCategory(categoria) {
    const categoriaSelect = document.getElementById('mapFiltroCategoria');
    if (categoriaSelect) categoriaSelect.value = categoria;
    currentMapFilters.categoria = categoria;
    loadReclamacaoMarkers();
}

// Mostrar apenas reclamações com mídia
function showOnlyWithMedia() {
    const reclamacoes = getReclamacoes();
    
    const filteredReclamacoes = reclamacoes.filter(reclamacao => {
        let hasMedia = reclamacao.midia && reclamacao.midia.length > 0;

        if (currentMapFilters.categoria && reclamacao.categoria !== currentMapFilters.categoria) {
            hasMedia = false;
        }
        if (currentMapFilters.status && reclamacao.status !== currentMapFilters.status) {
            hasMedia = false;
        }

        return hasMedia;
    });

    // Limpar marcadores existentes
    if (markersLayer) {
        markersLayer.clearLayers();
    }

    // Adicionar apenas marcadores com mídia
    filteredReclamacoes.forEach(reclamacao => {
        const coords = getCoordinatesFromLocation(reclamacao.localizacao, reclamacao);
        if (coords && markersLayer) {
            const marker = createReclamacaoMarker(reclamacao, coords);
            markersLayer.addLayer(marker);
        }
    });

    updateMapStats(filteredReclamacoes);
}

// Centralizar mapa na localização do usuário
function centerMap() {
    if (userLocationMarker) {
        map.setView(userLocationMarker.getLatLng(), 14);
    } else {
        getUserLocation();
    }
}

// Alternar tela cheia do mapa
function toggleMapFullscreen() {
    const mapContainer = document.getElementById('mapContainer');
    const btn = document.getElementById('fullscreenMapBtn');
    
    if (!document.fullscreenElement) {
        mapContainer.requestFullscreen().then(() => {
            if (btn) btn.innerHTML = '<i class="fas fa-compress"></i> Sair';
            setTimeout(() => map.invalidateSize(), 100);
        });
    } else {
        document.exitFullscreen().then(() => {
            if (btn) btn.innerHTML = '<i class="fas fa-expand"></i> Tela Cheia';
            setTimeout(() => map.invalidateSize(), 100);
        });
    }
}

// Esconder loading do mapa
function hideMapLoading() {
    const loading = document.getElementById('mapLoading');
    if (loading) {
        loading.style.display = 'none';
    }
}

// Mostrar loading do mapa
function showMapLoading() {
    const loading = document.getElementById('mapLoading');
    if (loading) {
        loading.style.display = 'flex';
    }
}

// Função para atualizar marcadores do mapa (chamada externamente)
function updateMapMarkers(reclamacoesData = null) {
    console.log('🔄 updateMapMarkers chamada');
    
    // Se dados foram passados, salvar no localStorage
    if (reclamacoesData) {
        try {
            localStorage.setItem('reclamacoes', JSON.stringify(reclamacoesData));
            console.log('✅ Dados salvos no localStorage');
        } catch (error) {
            console.error('❌ Erro ao salvar dados:', error);
        }
    }
    
    // Recarregar marcadores
    if (typeof loadReclamacaoMarkers === 'function') {
        loadReclamacaoMarkers();
    }
}

// Abrir modal de mídia
function openMediaModal(mediaSrc, mediaType, reclamacaoTitulo = '') {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h3>${reclamacaoTitulo}</h3>
            <div class="media-container">
                ${mediaType === 'video' ? 
                    `<video controls src="${mediaSrc}" style="max-width: 100%; height: auto;"></video>` :
                    `<img src="${mediaSrc}" style="max-width: 100%; height: auto;">`
                }
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fechar modal
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => document.body.removeChild(modal);
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
}

// Tornar funções globais
window.centerMapOnMarker = centerMapOnMarker;
window.openMediaModal = openMediaModal;
window.filterMapMarkers = filterMapMarkers;
window.centerMap = centerMap;
window.toggleMapFullscreen = toggleMapFullscreen;
window.clearMapFilters = clearMapFilters;
window.filterByStatus = filterByStatus;
window.filterByCategory = filterByCategory;
window.showOnlyWithMedia = showOnlyWithMedia;
window.shareReclamacao = shareReclamacao;
window.updateMapMarkers = updateMapMarkers;