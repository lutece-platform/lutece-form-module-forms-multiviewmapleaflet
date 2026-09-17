/*
 * Copyright (c) 2002-2018, Mairie de Paris
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 *  1. Redistributions of source code must retain the above copyright notice
 *     and the following disclaimer.
 *
 *  2. Redistributions in binary form must reproduce the above copyright notice
 *     and the following disclaimer in the documentation and/or other materials
 *     provided with the distribution.
 *
 *  3. Neither the name of 'Mairie de Paris' nor 'Lutece' nor the names of its
 *     contributors may be used to endorse or promote products derived from
 *     this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 * License 1.0
 */
package fr.paris.lutece.plugins.forms.modules.multiviewmapleaflet.service;

import java.util.HashMap;
import java.util.Map;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import fr.paris.lutece.plugins.forms.service.IMultiviewMapProvider;
import fr.paris.lutece.portal.service.template.AppTemplateService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;

/**
 * Simple Leaflet + MarkerCluster implementation of IMultiviewMapProvider
 */
@ApplicationScoped
@Named( LeafletMultiviewMapProvider.BEAN_NAME )
public class LeafletMultiviewMapProvider implements IMultiviewMapProvider
{

    /**
     * Name to list in the forms.mapProvider.beanName.list property to select this provider.
     */
    public static final String BEAN_NAME = "forms-multiviewmapleaflet.mapProvider";

    private static final String LEAFLET_MULTIVIEWMAP_TEMPLATE = "admin/plugins/forms/modules/multiviewmapleaflet/map.html";
    private static final String MARK_TILE_URL = "tile_url";
    private static final String MARK_TILE_ATTRIBUTION = "tile_attribution";

    @Inject
    @ConfigProperty( name = "forms-multiviewmapleaflet.tile.url", defaultValue = "https://tile.openstreetmap.org/{z}/{x}/{y}.png" )
    private String _strTileUrl;

    @Inject
    @ConfigProperty( name = "forms-multiviewmapleaflet.tile.attribution", defaultValue = "Map data &copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors" )
    private String _strTileAttribution;

    /**
     * {@inheritDoc}
     */
    @Override
    public String getMapTemplate( )
    {
        Map<String, Object> model = new HashMap<>( );
        model.put( MARK_TILE_URL, _strTileUrl );
        model.put( MARK_TILE_ATTRIBUTION, _strTileAttribution );

        return AppTemplateService.getTemplate( LEAFLET_MULTIVIEWMAP_TEMPLATE, null, model ).getHtml( );
    }
}
